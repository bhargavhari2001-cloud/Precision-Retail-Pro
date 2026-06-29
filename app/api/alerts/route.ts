import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/alerts — low-stock email digest via Resend (free tier: 3,000/mo).
 * Body: { items: { SKU: string; currentStock: number; reorderPoint: number }[], to?: string }
 * No-op (200, sent:false) when RESEND_API_KEY is not configured.
 * Plain fetch — no SDK dependency.
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.ALERT_FROM_EMAIL || "alerts@resend.dev";
    const body = await request.json();
    const items: { SKU: string; currentStock: number; reorderPoint: number }[] =
      Array.isArray(body?.items) ? body.items.slice(0, 100) : [];
    const to = typeof body?.to === "string" ? body.to : process.env.ALERT_TO_EMAIL;

    if (!items.length) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }
    if (!apiKey || !to) {
      return NextResponse.json({
        sent: false,
        reason: "Email not configured. Set RESEND_API_KEY and ALERT_TO_EMAIL in .env.local.",
      });
    }

    const rows = items
      .map((i) => `<tr><td>${i.SKU}</td><td align="right">${i.currentStock}</td><td align="right">${i.reorderPoint}</td></tr>`)
      .join("");
    const html = `<h2>Low-stock alert — ${items.length} SKU(s) at or below reorder point</h2>
<table border="1" cellpadding="6" cellspacing="0">
<tr><th>SKU</th><th>Current stock</th><th>Reorder point</th></tr>${rows}</table>
<p>Sent by Precision Retail Pro.</p>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject: `Low-stock alert: ${items.length} SKU(s) need reordering`, html }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json({ sent: false, reason: `Resend error: ${detail.slice(0, 200)}` }, { status: 502 });
    }
    return NextResponse.json({ sent: true, count: items.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
