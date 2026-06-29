"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  Download,
  Zap,
  Sheet,
  Link,
  Loader2,
} from "lucide-react";
import { parseInventoryCSV, parseSalesCSV, inventoryTemplateCSV, salesTemplateCSV } from "@/lib/csvParser";
import { extractSpreadsheetId, parseInventorySheet, parseSalesSheet } from "@/lib/googleSheets";
import { useStore } from "@/lib/store";
import type { InventoryRow, SalesRow } from "@/types";

// ── CSV DropZone ──────────────────────────────────────────────────────────────

function DropZone({
  label,
  icon: Icon,
  onFile,
  fileName,
  accent,
}: {
  label: string;
  icon: typeof Upload;
  onFile: (text: string) => void;
  fileName: string | null;
  accent: "cyan" | "purple";
}) {
  const [dragging, setDragging] = useState(false);
  const borderColor =
    accent === "cyan"
      ? "border-cyan-500/30 hover:border-cyan-400/60"
      : "border-purple-500/30 hover:border-purple-400/60";
  const glowColor =
    accent === "cyan"
      ? "shadow-[0_0_20px_rgba(0,255,255,0.12)]"
      : "shadow-[0_0_20px_rgba(168,85,247,0.12)]";
  const iconColor = accent === "cyan" ? "text-cyan-400" : "text-purple-400";
  const textColor = accent === "cyan" ? "text-cyan-300" : "text-purple-300";

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) file.text().then(onFile);
    },
    [onFile]
  );

  return (
    <label
      className={`relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed bg-black/60 px-8 py-12 transition-all ${borderColor} ${glowColor} ${
        dragging ? "drop-zone-active" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".csv"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) f.text().then(onFile);
        }}
      />
      {fileName ? (
        <>
          <CheckCircle
            size={32}
            className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]"
          />
          <p className={`font-mono text-xs uppercase tracking-widest ${textColor}`}>{fileName}</p>
          <p className="font-mono text-[10px] text-zinc-600">Click to replace</p>
        </>
      ) : (
        <>
          <Icon size={32} className={`${iconColor}`} />
          <div className="text-center">
            <p
              className={`font-mono text-xs font-semibold uppercase tracking-[0.2em] ${textColor}`}
            >
              {label}
            </p>
            <p className="mt-1 font-mono text-[10px] text-zinc-600">
              Drag & drop or click to upload .csv
            </p>
          </div>
        </>
      )}
    </label>
  );
}

// ── Google Sheets input row ───────────────────────────────────────────────────

function SheetInput({
  label,
  accent,
  url,
  sheetName,
  onUrlChange,
  onSheetNameChange,
  status,
  onFetch,
  loading,
}: {
  label: string;
  accent: "cyan" | "purple";
  url: string;
  sheetName: string;
  onUrlChange: (v: string) => void;
  onSheetNameChange: (v: string) => void;
  status: string | null;
  onFetch: () => void;
  loading: boolean;
}) {
  const borderColor = accent === "cyan" ? "border-cyan-500/30" : "border-purple-500/30";
  const focusBorder = accent === "cyan" ? "focus:border-cyan-400/60" : "focus:border-purple-400/60";
  const labelColor = accent === "cyan" ? "text-cyan-500/70" : "text-purple-500/70";
  const btnColor =
    accent === "cyan"
      ? "border-cyan-500/40 text-cyan-400 hover:border-cyan-400/70 hover:bg-cyan-500/10"
      : "border-purple-500/40 text-purple-400 hover:border-purple-400/70 hover:bg-purple-500/10";

  return (
    <div className={`rounded-lg border ${borderColor} bg-black/60 p-4 space-y-3`}>
      <p className={`font-mono text-[10px] uppercase tracking-widest ${labelColor}`}>{label}</p>

      <div className="flex items-center gap-2">
        <Link size={12} className="text-zinc-600 shrink-0" />
        <input
          type="text"
          placeholder="Paste Google Sheets URL or spreadsheet ID"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className={`flex-1 rounded border ${borderColor} ${focusBorder} bg-zinc-900/80 px-3 py-1.5 font-mono text-[11px] text-zinc-300 placeholder-zinc-700 outline-none transition-colors`}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Sheet tab name (default: Sheet1)"
          value={sheetName}
          onChange={(e) => onSheetNameChange(e.target.value)}
          className={`w-52 rounded border ${borderColor} ${focusBorder} bg-zinc-900/80 px-3 py-1.5 font-mono text-[11px] text-zinc-300 placeholder-zinc-700 outline-none transition-colors`}
        />

        <button
          onClick={onFetch}
          disabled={!url.trim() || loading}
          className={`flex items-center gap-2 rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-700 ${btnColor}`}
        >
          {loading ? <Loader2 size={11} className="animate-spin" /> : <Sheet size={11} />}
          {loading ? "Fetching…" : "Fetch Sheet"}
        </button>

        {status && (
          <span className="flex items-center gap-1 font-mono text-[10px] text-green-400">
            <CheckCircle size={11} /> {status}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function downloadCSV(content: string, name: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UploadPage() {
  const router = useRouter();
  const { setInventoryData, setSalesData, setAnalysisResult, setIsAnalyzing } = useStore();

  // Source toggle
  const [source, setSource] = useState<"csv" | "sheets">("csv");

  // CSV state
  const [invFileName, setInvFileName] = useState<string | null>(null);
  const [salesFileName, setSalesFileName] = useState<string | null>(null);
  const [invData, setInvDataLocal] = useState<InventoryRow[] | null>(null);
  const [salesDataLocal, setSalesDataLocal] = useState<SalesRow[] | null>(null);

  // Google Sheets state
  const [invSheetUrl, setInvSheetUrl] = useState("");
  const [invSheetTab, setInvSheetTab] = useState("Sheet1");
  const [salesSheetUrl, setSalesSheetUrl] = useState("");
  const [salesSheetTab, setSalesSheetTab] = useState("Sheet1");
  const [invSheetStatus, setInvSheetStatus] = useState<string | null>(null);
  const [salesSheetStatus, setSalesSheetStatus] = useState<string | null>(null);
  const [invSheetLoading, setInvSheetLoading] = useState(false);
  const [salesSheetLoading, setSalesSheetLoading] = useState(false);

  // Shared state
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "analyzing" | "done">("idle");

  // ── CSV handlers ──
  const handleInv = (text: string) => {
    const { data, errors } = parseInventoryCSV(text);
    if (errors.length) { setErrors(errors); return; }
    setErrors([]);
    setInvFileName(`inventory.csv — ${data.length} SKUs loaded`);
    setInvDataLocal(data);
  };

  const handleSales = (text: string) => {
    const { data, errors } = parseSalesCSV(text);
    if (errors.length) { setErrors(errors); return; }
    setErrors([]);
    setSalesFileName(`sales.csv — ${data.length} rows loaded`);
    setSalesDataLocal(data);
  };

  // ── Google Sheets fetch ──
  async function fetchSheet(
    rawUrl: string,
    tabName: string,
    type: "inventory" | "sales"
  ) {
    const setLoading = type === "inventory" ? setInvSheetLoading : setSalesSheetLoading;
    const setSheetStatus = type === "inventory" ? setInvSheetStatus : setSalesSheetStatus;

    setLoading(true);
    setErrors([]);

    const spreadsheetId = extractSpreadsheetId(rawUrl);
    if (!spreadsheetId) {
      setErrors(["Could not parse a spreadsheet ID from that URL."]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/sheets?spreadsheetId=${encodeURIComponent(spreadsheetId)}&sheetName=${encodeURIComponent(tabName || "Sheet1")}`
      );
      const json = await res.json() as { values?: string[][]; error?: string };

      if (!res.ok || json.error) {
        setErrors([json.error ?? "Failed to fetch sheet."]);
        setLoading(false);
        return;
      }

      if (type === "inventory") {
        const { data, errors } = parseInventorySheet(json.values ?? []);
        if (errors.length) { setErrors(errors); setLoading(false); return; }
        setInvDataLocal(data);
        setSheetStatus(`${data.length} SKUs loaded`);
      } else {
        const { data, errors } = parseSalesSheet(json.values ?? []);
        if (errors.length) { setErrors(errors); setLoading(false); return; }
        setSalesDataLocal(data);
        setSheetStatus(`${data.length} rows loaded`);
      }
    } catch {
      setErrors(["Network error — could not reach the server."]);
    } finally {
      setLoading(false);
    }
  }

  // ── Run analysis ──
  const runAnalysis = async () => {
    if (!invData || !salesDataLocal) return;
    setStatus("analyzing");
    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventory: invData, sales: salesDataLocal }),
      });
      const result = await res.json();
      setInventoryData(invData);
      setSalesData(salesDataLocal);
      setAnalysisResult(result);
      setStatus("done");
      setTimeout(() => router.push("/dashboard"), 800);
    } catch {
      setErrors(["Analysis failed. Please try again."]);
      setStatus("idle");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ready = !!invData && !!salesDataLocal;

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-cyan-500" />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-500">
            System Init
          </p>
        </div>
        <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-white">
          Upload <span className="text-cyan-300">Data Files</span>
        </h1>
        <p className="mt-1 font-mono text-xs text-zinc-500">
          Upload CSV files or import directly from Google Sheets.
        </p>
      </div>

      {/* Source toggle */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSource("csv")}
          className={`flex items-center gap-2 rounded border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
            source === "csv"
              ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-300 shadow-[0_0_14px_rgba(0,255,255,0.15)]"
              : "border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
          }`}
        >
          <FileText size={12} /> CSV Files
        </button>
        <button
          onClick={() => setSource("sheets")}
          className={`flex items-center gap-2 rounded border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
            source === "sheets"
              ? "border-green-400/60 bg-green-500/10 text-green-300 shadow-[0_0_14px_rgba(74,222,128,0.15)]"
              : "border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
          }`}
        >
          <Sheet size={12} /> Google Sheets
        </button>
      </div>

      {/* CSV mode */}
      {source === "csv" && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <DropZone
              label="Inventory CSV"
              icon={FileText}
              onFile={handleInv}
              fileName={invFileName}
              accent="cyan"
            />
            <DropZone
              label="Sales History CSV"
              icon={Upload}
              onFile={handleSales}
              fileName={salesFileName}
              accent="purple"
            />
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => downloadCSV(inventoryTemplateCSV(), "inventory_template.csv")}
              className="flex items-center gap-2 rounded border border-cyan-500/20 bg-black/60 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-cyan-600 transition-all hover:border-cyan-500/50 hover:text-cyan-400"
            >
              <Download size={11} /> Inventory Template
            </button>
            <button
              onClick={() => downloadCSV(salesTemplateCSV(), "sales_template.csv")}
              className="flex items-center gap-2 rounded border border-purple-500/20 bg-black/60 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-purple-600 transition-all hover:border-purple-500/50 hover:text-purple-400"
            >
              <Download size={11} /> Sales Template
            </button>
          </div>
        </>
      )}

      {/* Google Sheets mode */}
      {source === "sheets" && (
        <div className="mb-6 space-y-4">
          <SheetInput
            label="Inventory Sheet"
            accent="cyan"
            url={invSheetUrl}
            sheetName={invSheetTab}
            onUrlChange={setInvSheetUrl}
            onSheetNameChange={setInvSheetTab}
            status={invSheetStatus}
            loading={invSheetLoading}
            onFetch={() => fetchSheet(invSheetUrl, invSheetTab, "inventory")}
          />
          <SheetInput
            label="Sales History Sheet"
            accent="purple"
            url={salesSheetUrl}
            sheetName={salesSheetTab}
            onUrlChange={setSalesSheetUrl}
            onSheetNameChange={setSalesSheetTab}
            status={salesSheetStatus}
            loading={salesSheetLoading}
            onFetch={() => fetchSheet(salesSheetUrl, salesSheetTab, "sales")}
          />

          <div className="rounded-lg border border-green-900/40 bg-green-950/20 p-3">
            <p className="font-mono text-[10px] text-green-700">
              The spreadsheet must be shared with{" "}
              <span className="text-green-500">&quot;Anyone with the link — Viewer&quot;</span>.
              The sheet tab name must match exactly (case-sensitive).
            </p>
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mb-6 rounded border border-red-500/40 bg-red-500/10 p-4">
          {errors.map((e, i) => (
            <p key={i} className="flex items-center gap-2 font-mono text-xs text-red-300">
              <AlertTriangle size={12} /> {e}
            </p>
          ))}
        </div>
      )}

      {/* Run button */}
      <button
        onClick={runAnalysis}
        disabled={!ready || status === "analyzing"}
        className={`relative flex items-center gap-3 rounded border px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.2em] transition-all ${
          ready && status !== "analyzing"
            ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:bg-cyan-500/20 hover:shadow-[0_0_32px_rgba(0,255,255,0.35)]"
            : "cursor-not-allowed border-zinc-800 text-zinc-700"
        }`}
      >
        <Zap size={15} />
        {status === "analyzing" ? "Running Analysis..." : "Run AI Analysis"}
        {status === "done" && <CheckCircle size={15} className="text-green-400" />}
      </button>

      {/* Column reference */}
      <div className="mt-8 rounded-lg border border-zinc-800/60 bg-black/40 p-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          Required Columns
        </p>
        <div className="grid grid-cols-1 gap-4 text-[11px] sm:grid-cols-2">
          <div>
            <p className="font-mono text-cyan-500/70">inventory (CSV or Sheet)</p>
            <p className="mt-0.5 font-mono text-zinc-600">SKU · Cost · Price · Current_Stock</p>
          </div>
          <div>
            <p className="font-mono text-purple-500/70">sales_history (CSV or Sheet)</p>
            <p className="mt-0.5 font-mono text-zinc-600">Date · SKU · Sales</p>
          </div>
        </div>
      </div>
    </div>
  );
}
