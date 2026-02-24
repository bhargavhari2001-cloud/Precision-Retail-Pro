"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ChevronDown, Cpu, Info } from "lucide-react";
import { useStore } from "@/lib/store";
import ForecastChart from "@/components/ForecastChart";
import { storage } from "@/lib/storage";
import type { ForecastResult } from "@/types";

export default function ForecastingPage() {
  const router = useRouter();
  const { analysisResult, salesData, inventoryData, setAnalysisResult } = useStore();

  const [selectedSKU, setSelectedSKU] = useState<string>("");
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from storage
  useEffect(() => {
    if (!analysisResult) {
      const saved = storage.loadAnalysis();
      if (saved) setAnalysisResult(saved);
      else router.push("/");
    }
  }, [analysisResult, setAnalysisResult, router]);

  const skus = analysisResult?.metrics.map((m) => m.SKU) ?? [];

  useEffect(() => {
    if (skus.length > 0 && !selectedSKU) setSelectedSKU(skus[0]);
  }, [skus, selectedSKU]);

  const runForecast = async (sku: string) => {
    if (!sku || !salesData) return;
    setLoading(true);
    setError(null);
    setForecast(null);

    try {
      const currentStock =
        inventoryData?.find((r) => r.SKU === sku)?.Current_Stock ?? 0;

      const res = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku, salesHistory: salesData, currentStock }),
      });

      if (!res.ok) throw new Error("Forecast request failed");
      const data = await res.json();
      setForecast(data.result);
    } catch {
      setError("Failed to fetch forecast. Check your GOOGLE_API_KEY.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-run when SKU changes
  useEffect(() => {
    if (selectedSKU && salesData) runForecast(selectedSKU);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSKU]);

  const currentMetric = analysisResult?.metrics.find((m) => m.SKU === selectedSKU);

  if (!analysisResult) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-purple-500" />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-purple-500">
            Intelligence Engine
          </p>
        </div>
        <h1 className="mt-2 font-mono text-3xl font-bold text-white">
          AI <span className="text-purple-300">Forecasting</span>
        </h1>
        <p className="mt-1 font-mono text-xs text-zinc-500">
          Claude AI analyses your sales patterns and predicts the next 30 days of demand.
        </p>
      </div>

      {/* SKU selector */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative">
          <select
            value={selectedSKU}
            onChange={(e) => setSelectedSKU(e.target.value)}
            className="appearance-none rounded border border-cyan-500/30 bg-black/70 py-2.5 pl-4 pr-10 font-mono text-xs text-cyan-300 outline-none focus:border-cyan-500/60 focus:shadow-[0_0_12px_rgba(0,255,255,0.15)]"
          >
            {skus.map((s) => (
              <option key={s} value={s} className="bg-black">
                {s}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500"
          />
        </div>

        {/* Current metric pills */}
        {currentMetric && (
          <div className="flex flex-wrap gap-2">
            <span className="rounded border border-zinc-700 bg-black/60 px-3 py-1.5 font-mono text-[10px] text-zinc-400">
              Stock: <span className="text-white">{currentMetric.Current_Stock}</span>
            </span>
            <span
              className={`rounded border px-3 py-1.5 font-mono text-[10px] ${
                currentMetric.DSI < 14
                  ? "border-red-500/40 text-red-400"
                  : currentMetric.DSI > 90
                  ? "border-amber-500/40 text-amber-400"
                  : "border-cyan-500/40 text-cyan-400"
              }`}
            >
              DSI: {currentMetric.DSI >= 999 ? "∞" : `${currentMetric.DSI}d`}
            </span>
            <span
              className={`rounded border px-3 py-1.5 font-mono text-[10px] ${
                currentMetric.Status === "Urgent Reorder"
                  ? "border-red-500/40 text-red-400"
                  : currentMetric.Status === "Dead Stock"
                  ? "border-amber-500/40 text-amber-400"
                  : "border-cyan-500/40 text-cyan-400"
              }`}
            >
              {currentMetric.Status}
            </span>
          </div>
        )}
      </div>

      {/* Chart */}
      {loading && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-purple-500/20 bg-black/60 p-6">
          <Cpu size={16} className="animate-pulse text-purple-400" />
          <p className="font-mono text-xs uppercase tracking-widest text-purple-400">
            Claude AI is analysing {selectedSKU}...
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded border border-red-500/40 bg-red-500/10 p-4">
          <p className="font-mono text-xs text-red-300">{error}</p>
        </div>
      )}

      {forecast && !loading && (
        <>
          <ForecastChart
            points={forecast.points}
            sku={forecast.sku}
            currentStock={currentMetric?.Current_Stock}
          />

          {/* AI insight panel */}
          {forecast.insight && (
            <div className="mt-4 rounded-lg border border-purple-500/30 bg-purple-500/5 p-5 shadow-[0_0_16px_rgba(168,85,247,0.08)]">
              <div className="mb-2 flex items-center gap-2">
                <Info size={13} className="text-purple-400" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-purple-400">
                  Claude AI Insight — {forecast.method}
                </p>
              </div>
              <p className="font-mono text-xs leading-relaxed text-zinc-300">{forecast.insight}</p>
            </div>
          )}

          {/* Forecast stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded border border-zinc-800 bg-black/60 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                Avg Daily Demand
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-cyan-300">
                {forecast.avgDailyDemand} units
              </p>
            </div>
            <div className="rounded border border-zinc-800 bg-black/60 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                30-Day Forecast Total
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-purple-300">
                {Math.round(forecast.avgDailyDemand * 30)} units
              </p>
            </div>
            <div className="rounded border border-zinc-800 bg-black/60 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                Method
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-amber-300">{forecast.method}</p>
            </div>
          </div>
        </>
      )}

      {/* Hint when no data */}
      {!loading && !forecast && !error && (
        <div className="flex h-48 items-center justify-center rounded-lg border border-zinc-800 bg-black/40">
          <div className="text-center">
            <TrendingUp size={24} className="mx-auto mb-2 text-zinc-700" />
            <p className="font-mono text-xs text-zinc-600">Select a SKU to run an AI forecast</p>
          </div>
        </div>
      )}
    </div>
  );
}
