"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Package } from "lucide-react";
import { useStore } from "@/lib/store";
import InventoryTable from "@/components/InventoryTable";
import ReorderPlan from "@/components/ReorderPlan";
import { storage } from "@/lib/storage";
import type { InventoryMetric, StockStatus } from "@/types";

const STATUS_FILTERS: { label: string; value: StockStatus | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Urgent Reorder", value: "Urgent Reorder" },
  { label: "Dead Stock", value: "Dead Stock" },
  { label: "Healthy", value: "Healthy" },
];

const filterBtnStyle = (active: boolean, status: string) => {
  if (!active) return "border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400";
  if (status === "Urgent Reorder") return "border-red-500/50 bg-red-500/10 text-red-300";
  if (status === "Dead Stock") return "border-amber-500/50 bg-amber-500/10 text-amber-300";
  if (status === "Healthy") return "border-cyan-500/50 bg-cyan-500/10 text-cyan-300";
  return "border-purple-500/50 bg-purple-500/10 text-purple-300";
};

export default function InventoryPage() {
  const router = useRouter();
  const { analysisResult, setAnalysisResult } = useStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockStatus | "All">("All");

  useEffect(() => {
    if (!analysisResult) {
      const saved = storage.loadAnalysis();
      if (saved) setAnalysisResult(saved);
      else router.push("/upload");
    }
  }, [analysisResult, setAnalysisResult, router]);

  if (!analysisResult) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-600">Loading...</p>
      </div>
    );
  }

  const filtered: InventoryMetric[] = analysisResult.metrics.filter((m) => {
    const matchSearch = m.SKU.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || m.Status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-purple-500" />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-purple-500">
            Inventory Layer
          </p>
        </div>
        <h1 className="mt-2 font-mono text-3xl font-bold text-white">
          Inventory <span className="text-purple-300">Grid</span>
        </h1>
        <p className="mt-1 font-mono text-xs text-zinc-500">
          {analysisResult.metrics.length} SKUs · Click filters to narrow results
        </p>
      </div>

      {/* Controls */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
          />
          <input
            type="text"
            placeholder="Search SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-zinc-800 bg-black/60 py-2 pl-8 pr-3 font-mono text-xs text-zinc-300 placeholder-zinc-700 outline-none focus:border-cyan-500/40 focus:shadow-[0_0_12px_rgba(0,255,255,0.1)]"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2">
          <Filter size={12} className="text-zinc-600" />
          {STATUS_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all ${filterBtnStyle(statusFilter === value, value)}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Count badge */}
      <div className="mb-3 flex items-center gap-2">
        <Package size={12} className="text-cyan-400" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-600">
          Showing {filtered.length} of {analysisResult.metrics.length} SKUs
        </p>
      </div>

      <ReorderPlan metrics={analysisResult.metrics} />

      {/* Table */}
      {filtered.length > 0 ? (
        <InventoryTable metrics={filtered} />
      ) : (
        <div className="flex h-32 items-center justify-center rounded-lg border border-zinc-800 bg-black/40">
          <p className="font-mono text-xs text-zinc-600">No SKUs match your filters.</p>
        </div>
      )}
    </div>
  );
}
