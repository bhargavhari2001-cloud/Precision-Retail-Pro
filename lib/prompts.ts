import type { SalesRow } from "@/types";

// ── Gemini AI forecast prompt ─────────────────────────────────────────────────

export function buildForecastPrompt(
  sku: string,
  salesHistory: SalesRow[],
  currentStock: number
): string {
  const sorted = [...salesHistory]
    .filter((r) => r.SKU === sku)
    .sort((a, b) => a.Date.localeCompare(b.Date));

  const salesSummary = sorted
    .slice(-60) // last 60 rows max
    .map((r) => `${r.Date}: ${r.Sales} units`)
    .join("\n");

  return `You are a retail inventory analyst. Analyse the sales history below for SKU "${sku}" and produce a 30-day demand forecast.

Current stock on hand: ${currentStock} units

Sales history (daily units sold):
${salesSummary || "No historical data available."}

Respond with ONLY a valid JSON object — no markdown, no commentary — in exactly this shape:
{
  "avgDailyDemand": <number, 1 decimal place>,
  "forecastValues": [<30 daily numbers, each to 1 decimal>],
  "insight": "<2-3 sentence plain-English business insight covering trend, risk and recommended action>"
}`;
}
