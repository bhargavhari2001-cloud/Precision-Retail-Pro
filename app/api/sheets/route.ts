import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/sheets?spreadsheetId=<ID>&sheetName=<name>
 *
 * Server-side proxy that fetches raw values from a public Google Sheet using
 * the server-only GOOGLE_API_KEY.  Returns { values: string[][] }.
 *
 * The spreadsheet must be shared with "Anyone with the link – Viewer".
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spreadsheetId = searchParams.get("spreadsheetId");
  const sheetName = searchParams.get("sheetName") || "Sheet1";

  if (!spreadsheetId) {
    return NextResponse.json({ error: "spreadsheetId is required" }, { status: 400 });
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
    const errBody = await sheetsRes.json().catch(() => ({}));
    const message =
      (errBody as { error?: { message?: string } }).error?.message ||
      `Google Sheets API error (${sheetsRes.status})`;
    return NextResponse.json({ error: message }, { status: sheetsRes.status });
  }

  const body = await sheetsRes.json() as { values?: string[][] };
  return NextResponse.json({ values: body.values ?? [] });
}
