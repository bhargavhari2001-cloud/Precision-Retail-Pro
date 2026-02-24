import type { InventoryRow, SalesRow } from "@/types";

// ── URL helpers ───────────────────────────────────────────────────────────────

/** Extract spreadsheet ID from any Google Sheets URL or return the raw value if it already looks like an ID. */
export function extractSpreadsheetId(input: string): string | null {
  // Full URL: https://docs.google.com/spreadsheets/d/<ID>/...
  const urlMatch = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) return urlMatch[1];

  // Plain ID (no slashes, reasonable length)
  if (/^[a-zA-Z0-9-_]{20,}$/.test(input.trim())) return input.trim();

  return null;
}

// ── Column normalisation (mirrors csvParser.ts) ────────────────────────────────

const INV_MAP: Record<string, string> = {
  sku: "SKU", product_id: "SKU", item_id: "SKU",
  cost: "Cost", unit_cost: "Cost",
  price: "Price", retail_price: "Price",
  current_stock: "Current_Stock", stock: "Current_Stock",
  qty: "Current_Stock", quantity: "Current_Stock",
};

const SALES_MAP: Record<string, string> = {
  date: "Date", transaction_date: "Date",
  sku: "SKU", product_id: "SKU",
  sales: "Sales", qty_sold: "Sales",
  quantity_sold: "Sales", units_sold: "Sales",
};

function normalise(row: Record<string, string>, map: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(row)) {
    const mapped = map[k.toLowerCase().trim()];
    out[mapped ?? k] = v;
  }
  return out;
}

// ── values[][] → typed rows ───────────────────────────────────────────────────

/** Convert raw Google Sheets values (first row = headers) into InventoryRow[]. */
export function parseInventorySheet(values: string[][]): { data: InventoryRow[]; errors: string[] } {
  if (!values || values.length < 2) {
    return { data: [], errors: ["Sheet appears to be empty or has no data rows."] };
  }

  const headers = values[0].map((h) => h.trim());
  const required = ["SKU", "Cost", "Price", "Current_Stock"];
  const rows: InventoryRow[] = [];
  const errors: string[] = [];

  for (let i = 1; i < values.length; i++) {
    const raw: Record<string, string> = {};
    headers.forEach((h, idx) => { raw[h] = (values[i][idx] ?? "").trim(); });

    const r = normalise(raw, INV_MAP);
    if (i === 1) {
      const missing = required.filter((c) => !(c in r));
      if (missing.length) {
        errors.push(`Missing columns: ${missing.join(", ")}. Found: ${headers.join(", ")}`);
        break;
      }
    }
    if (!r.SKU) continue; // skip blank rows

    const cost = parseFloat(r.Cost) || 0;
    const price = r.Price ? parseFloat(r.Price) : cost * 1.5;
    rows.push({
      SKU: r.SKU,
      Cost: cost,
      Price: price,
      Current_Stock: parseInt(r.Current_Stock) || 0,
    });
  }

  return { data: rows, errors };
}

/** Convert raw Google Sheets values (first row = headers) into SalesRow[]. */
export function parseSalesSheet(values: string[][]): { data: SalesRow[]; errors: string[] } {
  if (!values || values.length < 2) {
    return { data: [], errors: ["Sheet appears to be empty or has no data rows."] };
  }

  const headers = values[0].map((h) => h.trim());
  const required = ["Date", "SKU", "Sales"];
  const rows: SalesRow[] = [];
  const errors: string[] = [];

  for (let i = 1; i < values.length; i++) {
    const raw: Record<string, string> = {};
    headers.forEach((h, idx) => { raw[h] = (values[i][idx] ?? "").trim(); });

    const r = normalise(raw, SALES_MAP);
    if (i === 1) {
      const missing = required.filter((c) => !(c in r));
      if (missing.length) {
        errors.push(`Missing columns: ${missing.join(", ")}. Found: ${headers.join(", ")}`);
        break;
      }
    }
    if (!r.SKU || !r.Date) continue;

    rows.push({
      Date: r.Date,
      SKU: r.SKU,
      Sales: parseFloat(r.Sales) || 0,
    });
  }

  return { data: rows, errors };
}
