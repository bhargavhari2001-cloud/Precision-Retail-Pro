import Papa from "papaparse";
import type { InventoryRow, SalesRow } from "@/types";

// ── Column normalisation map ──────────────────────────────────────────────────

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

function normalise(row: Record<string, unknown>, map: Record<string, string>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    const mapped = map[k.toLowerCase()];
    out[mapped ?? k] = v;
  }
  return out;
}

// ── Parse helpers ─────────────────────────────────────────────────────────────

export function parseInventoryCSV(text: string): { data: InventoryRow[]; errors: string[] } {
  const result = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });

  if (result.errors.length) {
    return { data: [], errors: result.errors.map((e) => e.message) };
  }

  const required = ["SKU", "Cost", "Price", "Current_Stock"];
  const rows: InventoryRow[] = [];
  const errors: string[] = [];

  for (const raw of result.data) {
    const r = normalise(raw, INV_MAP) as Record<string, string>;
    const missing = required.filter((c) => !(c in r));
    if (missing.length) {
      errors.push(`Missing columns: ${missing.join(", ")}`);
      break;
    }
    // Auto-derive Price from Cost if absent
    const cost = parseFloat(r.Cost) || 0;
    const price = "Price" in r ? parseFloat(r.Price) : cost * 1.5;
    rows.push({
      SKU: String(r.SKU),
      Cost: cost,
      Price: price,
      Current_Stock: parseInt(r.Current_Stock) || 0,
    });
  }

  return { data: rows, errors };
}

export function parseSalesCSV(text: string): { data: SalesRow[]; errors: string[] } {
  const result = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });

  if (result.errors.length) {
    return { data: [], errors: result.errors.map((e) => e.message) };
  }

  const required = ["Date", "SKU", "Sales"];
  const rows: SalesRow[] = [];
  const errors: string[] = [];

  for (const raw of result.data) {
    const r = normalise(raw, SALES_MAP) as Record<string, string>;
    const missing = required.filter((c) => !(c in r));
    if (missing.length) {
      errors.push(`Missing columns: ${missing.join(", ")}`);
      break;
    }
    rows.push({
      Date: String(r.Date),
      SKU: String(r.SKU),
      Sales: parseFloat(r.Sales) || 0,
    });
  }

  return { data: rows, errors };
}

// ── Template generators ───────────────────────────────────────────────────────

export function inventoryTemplateCSV(): string {
  return Papa.unparse([
    { SKU: "SKU-001", Cost: 50.0, Price: 99.99, Current_Stock: 150 },
    { SKU: "SKU-002", Cost: 25.0, Price: 49.99, Current_Stock: 5 },
  ]);
}

export function salesTemplateCSV(): string {
  const rows = [];
  const base = new Date("2024-01-01");
  for (let i = 0; i < 60; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    rows.push({ Date: d.toISOString().split("T")[0], SKU: "SKU-001", Sales: Math.floor(Math.random() * 10 + 3) });
    rows.push({ Date: d.toISOString().split("T")[0], SKU: "SKU-002", Sales: Math.floor(Math.random() * 4 + 1) });
  }
  return Papa.unparse(rows);
}
