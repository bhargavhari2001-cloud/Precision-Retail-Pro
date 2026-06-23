import { NextRequest, NextResponse } from "next/server";
import { calculateMetrics, buildSummary } from "@/lib/metrics";
import type { AnalyzeRequest, AnalyzeResponse } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();

    if (!body.inventory?.length || !body.sales?.length) {
      return NextResponse.json<AnalyzeResponse>(
        { metrics: [], summary: { totalInventoryValue: 0, totalCashTrapped: 0, urgentReorderCount: 0, deadStockCount: 0, healthyCount: 0, skuCount: 0, abc: { A: 0, B: 0, C: 0 } }, error: "Both inventory and sales data are required." },
        { status: 400 }
      );
    }

    const metrics = calculateMetrics(body.inventory, body.sales);
    const summary = buildSummary(metrics);

    return NextResponse.json<AnalyzeResponse>({ metrics, summary });
  } catch (err) {
    console.error("[analyze] error:", err);
    return NextResponse.json<AnalyzeResponse>(
      { metrics: [], summary: { totalInventoryValue: 0, totalCashTrapped: 0, urgentReorderCount: 0, deadStockCount: 0, healthyCount: 0, skuCount: 0, abc: { A: 0, B: 0, C: 0 } }, error: "Internal error during analysis." },
      { status: 500 }
    );
  }
}
