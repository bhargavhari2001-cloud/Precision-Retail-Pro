"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Package, TrendingUp, Upload, Trash2, Zap } from "lucide-react";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/", label: "Upload Data", icon: Upload },
  { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
  { href: "/inventory", label: "Inventory Grid", icon: Package },
  { href: "/forecasting", label: "AI Forecast", icon: TrendingUp },
];

export default function Navigation() {
  const pathname = usePathname();
  const clearAll = useStore((s) => s.clearAll);

  return (
    <nav className="relative flex h-screen w-60 flex-col border-r border-cyan-500/20 bg-black px-3 py-6">
      {/* Glow line */}
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />

      {/* Logo */}
      <div className="mb-8 px-3">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-cyan-400 drop-shadow-[0_0_6px_rgba(0,255,255,0.8)]" />
          <p className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-cyan-300">
            Precision Retail
          </p>
        </div>
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-600">
          AI Inventory Intelligence
        </p>
        <div className="mt-3 h-px bg-gradient-to-r from-cyan-500/40 to-transparent" />
      </div>

      {/* Links */}
      <div className="flex flex-1 flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 rounded px-3 py-2.5 font-mono text-xs font-medium uppercase tracking-wider transition-all ${
                active
                  ? "border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(0,255,255,0.1)]"
                  : "border border-transparent text-zinc-600 hover:border-cyan-500/20 hover:bg-cyan-500/5 hover:text-cyan-400"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,255,255,0.8)]" />
              )}
              <Icon size={13} />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-cyan-900/40 pt-4">
        <button
          onClick={clearAll}
          className="flex w-full items-center gap-2 rounded px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-zinc-700 transition-all hover:border hover:border-red-500/30 hover:text-red-500"
        >
          <Trash2 size={11} />
          Purge Data
        </button>
      </div>
    </nav>
  );
}
