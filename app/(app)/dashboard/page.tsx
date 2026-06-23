"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, AlertTriangle, PackageX, Package, TrendingUp, Layers } from "lucide-react";
import { useStore } from "@/lib/store";
import MetricCard from "@/components/MetricCard";
import InventoryTable from "@/components/InventoryTable";
import { storage } from "@/lib/storage";

const fmt = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `$${(n / 1_000).toFixed(1)}K`
    : `$${n.toFixed(0)}`;

export default function DashboardPage() {
  const router = useRouter();
  const { analysisResult, setAnalysisResult } = useStore();

  // Hydrate from localStorage on first render
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

  const { summary, metrics } = analysisResult;
  const urgentItems = metrics.filter((m) => m.Status === "Urgent Reorder");
  const deadItems = metrics.filter((m) => m.Status === "Dead Stock");

  const totalRevContribution = metrics.reduce((s, m) => s + (m.Revenue_Contribution ?? 0), 0);
  const abcCards = [
    { cls: "A" as const, border: "border-emerald-500/40", text: "text-emerald-300", glow: "shadow-[0_0_16px_rgba(16,185,129,0.10)]", desc: "Top 80% of revenue · tight control" },
    { cls: "B" as const, border: "border-cyan-500/40", text: "text-cyan-300", glow: "shadow-[0_0_16px_rgba(0,255,255,0.08)]", desc: "Next 15% of revenue · standard control" },
    { cls: "C" as const, border: "border-zinc-600/40", text: "text-zinc-400", glow: "", desc: "Bottom 5% of revenue · minimal control" },
  ];
  const abcStat = (cls: "A" | "B" | "C") => {
    const items = metrics.filter((m) => m.ABC_Class === cls);
    const rev = items.reduce((s, m) => s + (m.Revenue_Contribution ?? 0), 0);
    return {
      count: items.length,
      revPct: totalRevContribution > 0 ? Math.round((rev / totalRevContribution) * 100) : 0,
    };
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-cyan-500" />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-500">
            Intelligence Layer
          </p>
        </div>
        <h1 className="mt-2 font-mono text-3xl font-bold text-white">
          Executive <span className="text-cyan-300">Dashboard</span>
        </h1>
      </div>

      {/* KPI Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Total Inventory Value"
          value={fmt(summary.totalInventoryValue)}
          sub={`${summary.skuCount} SKUs tracked`}
          icon={DollarSign}
          variant="cyan"
        />
        <MetricCard
          label="Cash Trapped"
          value={fmt(summary.totalCashTrapped)}
          sub={`${summary.deadStockCount} dead SKUs`}
          icon={PackageX}
          variant="amber"
        />
        <MetricCard
          label="Urgent Reorders"
          value={String(summary.urgentReorderCount)}
          sub="< 14 days of stock"
          icon={AlertTriangle}
          variant="red"
        />
        <MetricCard
          label="Healthy SKUs"
          value={String(summary.healthyCount)}
          sub={`of ${summary.skuCount} total`}
          icon={TrendingUp}
          variant="green"
        />
      </div>

      {/* ABC classification */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <Layers size={14} className="text-emerald-400" />
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-500">
            ABC Classification — Pareto by revenue
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {abcCards.map((c) => {
            const { count, revPct } = abcStat(c.cls);
            return (
              <div key={c.cls} className={`rounded-lg border ${c.border} bg-black/60 p-5 ${c.glow}`}>
                <div className="flex items-baseline justify-between">
                  <span className={`font-mono text-3xl font-bold ${c.text}`}>{c.cls}</span>
                  <span className={`font-mono text-sm ${c.text}`}>{revPct}% rev</span>
                </div>
                <p className={`mt-1 font-mono text-xs ${c.text} opacity-80`}>{count} SKUs</p>
                <p className="mt-2 font-mono text-[10px] text-zinc-600">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action panels */}
      {(urgentItems.length > 0 || deadItems.length > 0) && (
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Urgent reorders */}
          {urgentItems.length > 0 && (
            <div className="rounded-lg border border-red-500/30 bg-black/60 p-5 shadow-[0_0_16px_rgba(248,113,113,0.08)]">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400" />
                <p className="font-mono text-xs uppercase tracking-widest text-red-400">
                  Urgent Reorders — {urgentItems.length}
                </p>
              </div>
              <div className="space-y-2">
                {urgentItems.map((m) => (
                  <div
                    key={m.SKU}
                    className="flex items-center justify-between rounded border border-red-500/20 bg-red-500/5 px-3 py-2"
                  >
                    <span className="font-mono text-xs font-bold text-red-300">{m.SKU}</span>
                    <span className="font-mono text-xs text-zinc-500">
                      {m.Current_Stock} units · {m.DSI}d left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dead stock */}
          {deadItems.length > 0 && (
            <div className="rounded-lg border border-amber-500/30 bg-black/60 p-5 shadow-[0_0_16px_rgba(251,191,36,0.08)]">
              <div className="mb-3 flex items-center gap-2">
                <PackageX size={14} className="text-amber-400" />
                <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
                  Dead Stock — {deadItems.length}
                </p>
              </div>
              <div className="space-y-2">
                {deadItems.map((m) => (
                  <div
                    key={m.SKU}
                    className="flex items-center justify-between rounded border border-amber-500/20 bg-amber-500/5 px-3 py-2"
                  >
                    <span className="font-mono text-xs font-bold text-amber-300">{m.SKU}</span>
                    <span className="font-mono text-xs text-zinc-500">
                      ${m.Cash_Trapped.toLocaleString()} trapped
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full inventory preview */}
      <div>
        <div className="mb-3 flex items-center gap-3">
          <Package size={14} className="text-cyan-400" />
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-500">
            Full Inventory — {metrics.length} SKUs
          </p>
        </div>
        <InventoryTable metrics={metrics} />
      </div>
    </div>
  );
}
