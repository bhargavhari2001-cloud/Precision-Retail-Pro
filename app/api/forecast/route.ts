import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
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
    const body: ForecastRequest = await req.json();
    const { sku, salesHistory, currentStock } = body;

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
          insight: `Claude error: ${msg}`,
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
    console.error("[forecast] unexpected error:", err);
    return NextResponse.json<ForecastResponse>(
      {
        result: {
          sku: "",
          points: [],
          method: "Moving Average",
          avgDailyDemand: 0,
          insight: `Server error: ${err instanceof Error ? err.message : "Unknown error"}`,
        },
        error: err instanceof Error ? err.message : "Internal server error.",
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
