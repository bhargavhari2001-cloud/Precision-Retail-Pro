import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit, getClientIP, rateLimitError } from "@/lib/rateLimit";
import { buildForecastPrompt } from "@/lib/prompts";
import { movingAverageForecast } from "@/lib/metrics";
import type { ForecastRequest, ForecastResponse, ForecastPoint } from "@/types";

// ── Claude API call ───────────────────────────────────────────────────────────

async function callClaude(prompt: string): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  if (!text) throw new Error("Claude returned an empty response.");
  return text.trim();
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const rl = checkRateLimit(getClientIP(req), 10);
    if (!rl.allowed) return rateLimitError(rl.resetAt);

    const body: ForecastRequest = await req.json();
    const { sku, salesHistory, currentStock } = body;

    // Cap input sizes: this route can call a paid LLM, so an unbounded salesHistory
    // array would let anyone run up token costs once ANTHROPIC_API_KEY is configured.
    if (typeof sku === "string" && sku.length > 100) {
      return NextResponse.json({ error: "SKU too long (max 100 chars)." }, { status: 400 });
    }
    if (Array.isArray(salesHistory) && salesHistory.length > 5000) {
      return NextResponse.json(
        { error: "salesHistory too large (max 5,000 rows per request)." },
        { status: 400 }
      );
    }

    if (!sku || !salesHistory?.length) {
      return NextResponse.json<ForecastResponse>(
        {
          result: {
            sku,
            points: [],
            method: "Insufficient Data (Mean)",
            avgDailyDemand: 0,
            insight: "Not enough data to forecast.",
          },
          error: "SKU and sales history required.",
        },
        { status: 400 }
      );
    }

    // Sort historical data for this SKU
    const sorted = [...salesHistory]
      .filter((r) => r.SKU === sku)
      .sort((a, b) => a.Date.localeCompare(b.Date));

    // ── No API key → moving average fallback ─────────────────────────────────
    if (!process.env.ANTHROPIC_API_KEY) {
      const { avgDailyDemand, method } = movingAverageForecast(salesHistory, sku);
      const points = buildHistoricalPoints(sorted).concat(
        buildFuturePoints(sorted, avgDailyDemand)
      );
      return NextResponse.json<ForecastResponse>({
        result: {
          sku,
          points,
          method,
          avgDailyDemand,
          insight: "No ANTHROPIC_API_KEY configured — showing moving average forecast.",
        },
      });
    }

    // ── Claude AI forecast ────────────────────────────────────────────────────
    const prompt = buildForecastPrompt(sku, salesHistory, currentStock);

    let raw: string;
    try {
      raw = await callClaude(prompt);
    } catch (claudeErr) {
      const msg =
        claudeErr instanceof Error ? claudeErr.message : "Claude API call failed.";
      console.error("[forecast] Claude error:", msg);

      const { avgDailyDemand, method } = movingAverageForecast(salesHistory, sku);
      const points = buildHistoricalPoints(sorted).concat(
        buildFuturePoints(sorted, avgDailyDemand)
      );
      return NextResponse.json<ForecastResponse>({
        result: {
          sku,
          points,
          method,
          avgDailyDemand,
          insight:
            "AI forecast is temporarily unavailable — showing a moving-average forecast instead.",
        },
      });
    }

    // ── Parse Claude JSON response ────────────────────────────────────────────
    let parsed: { avgDailyDemand: number; forecastValues: number[]; insight: string };
    try {
      const jsonStr = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      parsed = JSON.parse(jsonStr);
    } catch {
      const { avgDailyDemand, method } = movingAverageForecast(salesHistory, sku);
      const points = buildHistoricalPoints(sorted).concat(
        buildFuturePoints(sorted, avgDailyDemand)
      );
      return NextResponse.json<ForecastResponse>({
        result: {
          sku,
          points,
          method,
          avgDailyDemand,
          insight: "Claude returned an unexpected format — showing moving average.",
        },
      });
    }

    const points = buildHistoricalPoints(sorted).concat(
      buildFuturePoints(sorted, parsed.avgDailyDemand, parsed.forecastValues)
    );

    return NextResponse.json<ForecastResponse>({
      result: {
        sku,
        points,
        method: "Claude AI",
        avgDailyDemand: parsed.avgDailyDemand,
        insight: parsed.insight,
      },
    });
  } catch (err) {
    // Log details server-side; return a generic message so internal error
    // text (stack/library internals) never reaches the client.
    console.error("[forecast] unexpected error:", err);
    return NextResponse.json<ForecastResponse>(
      {
        result: {
          sku: "",
          points: [],
          method: "Moving Average",
          avgDailyDemand: 0,
          insight: "The forecast service encountered an error. Please try again.",
        },
        error: "Internal server error.",
      },
      { status: 500 }
    );
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildHistoricalPoints(sorted: { Date: string; Sales: number }[]): ForecastPoint[] {
  return sorted.map((r) => ({ date: r.Date, value: r.Sales, type: "Historical" as const }));
}

function buildFuturePoints(
  sorted: { Date: string }[],
  avgDailyDemand: number,
  values?: number[]
): ForecastPoint[] {
  const lastDate =
    sorted.length > 0 ? new Date(sorted[sorted.length - 1].Date) : new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(lastDate);
    d.setDate(d.getDate() + i + 1);
    return {
      date: d.toISOString().split("T")[0],
      value: values
        ? Math.max(0, Math.round((values[i] ?? avgDailyDemand) * 10) / 10)
        : Math.round(avgDailyDemand * 10) / 10,
      type: "Predicted" as const,
    };
  });
}
