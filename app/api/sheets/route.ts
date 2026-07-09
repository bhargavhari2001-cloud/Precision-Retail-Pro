import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIP, rateLimitError } from "@/lib/rateLimit";

/**
 * GET /api/sheets?spreadsheetId=<ID>&sheetName=<name>
 *
 * Server-side proxy that fetches raw values from a public Google Sheet using
 * the server-only GOOGLE_API_KEY.  Returns { values: string[][] }.
 *
 * The spreadsheet must be shared with "Anyone with the link – Viewer".
 */
export async function GET(req: NextRequest) {
  const rl = checkRateLimit(getClientIP(req), 15);
  if (!rl.allowed) return rateLimitError(rl.resetAt);

  const { searchParams } = new URL(req.url);
  const spreadsheetId = searchParams.get("spreadsheetId");
  const sheetName = (searchParams.get("sheetName") || "Sheet1").slice(0, 100);

  if (!spreadsheetId) {
    return NextResponse.json({ error: "spreadsheetId is required" }, { status: 400 });
  }
  // Google spreadsheet IDs are URL-safe tokens; rejecting anything else prevents
  // path injection into the googleapis request URL built below.
  if (!/^[A-Za-z0-9_-]{10,120}$/.test(spreadsheetId)) {
    return NextResponse.json({ error: "Invalid spreadsheetId format." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const range = encodeURIComponent(sheetName);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  let sheetsRes: Response;
  try {
    sheetsRes = await fetch(url);
  } catch {
    return NextResponse.json({ error: "Network error fetching Google Sheet." }, { status: 502 });
  }

  if (!sheetsRes.ok) {
    // Log the real upstream error server-side only. Never echo Google's raw
    // message to the client — it can leak project/quota details and the exact
    // upstream URL. Return a generic, status-mapped message instead.
    const upstream = await sheetsRes.text().catch(() => "");
    console.error(`[sheets] upstream ${sheetsRes.status}:`, upstream.slice(0, 500));

    const status = sheetsRes.status;
    const message =
      status === 403
        ? "This spreadsheet is not shared publicly (set it to 'Anyone with the link – Viewer')."
        : status === 404
        ? "Spreadsheet or tab not found."
        : status === 429
        ? "Too many requests to the data provider. Please try again shortly."
        : status === 400
        ? "Invalid spreadsheet request."
        : "Could not fetch the Google Sheet.";
    return NextResponse.json({ error: message }, { status: status >= 500 ? 502 : status });
  }

  const body = await sheetsRes.json() as { values?: string[][] };
  return NextResponse.json({ values: body.values ?? [] });
}
