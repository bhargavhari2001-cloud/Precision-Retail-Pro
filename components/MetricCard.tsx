"use client";

import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  variant?: "cyan" | "purple" | "amber" | "green" | "red";
}

const styles: Record<string, { border: string; glow: string; icon: string; value: string }> = {
  cyan:   { border: "border-cyan-400/50",   glow: "shadow-[0_0_20px_rgba(0,255,255,0.12)]",   icon: "text-cyan-400",   value: "text-cyan-300" },
  purple: { border: "border-purple-400/50", glow: "shadow-[0_0_20px_rgba(168,85,247,0.12)]",  icon: "text-purple-400", value: "text-purple-300" },
  amber:  { border: "border-amber-400/50",  glow: "shadow-[0_0_20px_rgba(251,191,36,0.12)]",  icon: "text-amber-400",  value: "text-amber-300" },
  green:  { border: "border-green-400/50",  glow: "shadow-[0_0_20px_rgba(74,222,128,0.12)]",  icon: "text-green-400",  value: "text-green-300" },
  red:    { border: "border-red-400/50",    glow: "shadow-[0_0_20px_rgba(248,113,113,0.12)]", icon: "text-red-400",    value: "text-red-300" },
};

export default function MetricCard({ label, value, sub, icon: Icon, variant = "cyan" }: MetricCardProps) {
  const s = styles[variant];
  return (
    <div className={`relative overflow-hidden rounded-lg border bg-black/70 p-5 backdrop-blur-sm ${s.border} ${s.glow} transition-all hover:${s.glow.replace('0.12', '0.25')}`}>
      {/* Corner accent lines */}
      <div className={`absolute right-0 top-0 h-6 w-px ${s.border.replace('border', 'bg').replace('/50', '/60')}`} />
      <div className={`absolute right-0 top-0 h-px w-6 ${s.border.replace('border', 'bg').replace('/50', '/60')}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${s.icon} opacity-70`}>{label}</p>
          <p className={`mt-2 font-mono text-2xl font-bold tracking-tight ${s.value}`}>{value}</p>
          {sub && <p className="mt-1 font-mono text-[10px] text-zinc-600">{sub}</p>}
        </div>
        <div className={`shrink-0 rounded border ${s.border} bg-black/50 p-2 ${s.icon}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}
