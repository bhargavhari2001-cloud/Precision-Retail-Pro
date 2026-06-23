import { jsPDF } from "jspdf";
import type { ReorderLine } from "@/lib/reorder";

/**
 * Purchase-order PDF — one click from reorder plan to a supplier-ready
 * document. Uses jspdf; competitor parity with StockTrim/Inventory Planner.
 */
export function generatePurchaseOrderPdf(
  lines: ReorderLine[],
  opts?: { companyName?: string; supplierName?: string }
): void {
  const items = lines.filter((l) => l.orderNow && l.suggestedQty > 0);
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const M = 56;
  let y = M;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("PURCHASE ORDER", M, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 115);
  y += 22;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, M, y);
  y += 14;
  doc.text(`PO #: PO-${Date.now().toString().slice(-8)}`, M, y);
  if (opts?.companyName) {
    y += 14;
    doc.text(`From: ${opts.companyName}`, M, y);
  }
  if (opts?.supplierName) {
    y += 14;
    doc.text(`To: ${opts.supplierName}`, M, y);
  }
  y += 30;

  // table header
  const cols = [M, M + 150, M + 250, M + 350, M + 440];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(20, 20, 25);
  ["SKU", "Current stock", "Reorder point", "Order qty", "Est. cost"].forEach((h, i) =>
    doc.text(h, cols[i], y)
  );
  y += 8;
  doc.setDrawColor(200, 200, 205);
  doc.line(M, y, W - M, y);
  y += 16;

  doc.setFont("helvetica", "normal");
  let total = 0;
  for (const l of items) {
    if (y > 720) {
      doc.addPage();
      y = M;
    }
    doc.text(String(l.SKU), cols[0], y);
    doc.text(String(l.currentStock), cols[1], y);
    doc.text(String(l.reorderPoint), cols[2], y);
    doc.text(String(l.suggestedQty), cols[3], y);
    doc.text(`$${l.estimatedCost.toLocaleString()}`, cols[4], y);
    total += l.estimatedCost;
    y += 16;
  }

  y += 10;
  doc.line(M, y, W - M, y);
  y += 18;
  doc.setFont("helvetica", "bold");
  doc.text(`Total estimated cost: $${Math.round(total * 100) / 100}`, M, y);

  doc.save(`purchase_order_${new Date().toISOString().split("T")[0]}.pdf`);
}
