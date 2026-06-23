import Navigation from "@/components/Navigation";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ background: "#05070A" }}>
      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,229,232,0.1) 2px, rgba(34,229,232,0.1) 4px)",
        }}
      />
      {/* Grid background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,229,232,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,229,232,0.3) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />

      <div className="relative z-10 flex h-screen overflow-hidden">
        <Navigation />
        <main className="flex-1 overflow-y-auto bg-black/40 backdrop-blur-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
