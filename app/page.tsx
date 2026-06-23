"use client";

import { useEffect } from "react";

const GITHUB = "https://github.com/bhargavhari2001-cloud/Precision-Retail-Pro";

const LANDING_HTML = `
<a href="#main-content" class="skip-nav" style="position:absolute;left:-9999px">Skip to main content</a>

<!-- HEADER -->
<header id="site-header" role="banner" style="position:fixed;top:0;left:0;right:0;z-index:1000;padding:14px 0;background:rgba(5,7,10,0.86);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid rgba(34,229,232,0.12);transition:border-color 0.3s">
  <div class="wrap">
    <nav aria-label="Primary navigation" style="display:flex;align-items:center;justify-content:space-between;gap:24px">
      <a href="/" aria-label="Precision Retail Pro — Homepage" style="display:flex;align-items:center;gap:11px">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"><path d="M14 2L6 15h6l-2 9 10-14h-7l1-8z" fill="#22E5E8" stroke="#22E5E8" stroke-width="0.5" stroke-linejoin="round"></path></svg>
        <span style="font-weight:800;font-size:0.92rem;letter-spacing:0.14em;color:#E6EDF3;text-transform:uppercase;line-height:1.05">Precision<br><span style="color:#22E5E8">Retail</span></span>
      </a>
      <ul class="desktop-nav" style="display:flex;align-items:center;gap:28px" role="list">
        <li><a href="#features" class="nav-link">Modules</a></li>
        <li><a href="#how-it-works" class="nav-link">How It Works</a></li>
        <li><a href="#open-source" class="nav-link">Open Source</a></li>
        <li><a href="/upload" class="nav-link">Upload</a></li>
      </ul>
      <div class="desktop-nav" style="display:flex;align-items:center;gap:10px">
        <a href="${GITHUB}" class="btn btn-cyber btn-sm" target="_blank" rel="noopener noreferrer">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
          GitHub
        </a>
        <a href="/upload" class="btn btn-fill btn-sm">Launch App</a>
      </div>
      <button class="ham-btn" id="ham-btn" aria-expanded="false" aria-controls="mob-menu" aria-label="Open navigation menu" style="display:none;background:none;border:1px solid rgba(34,229,232,0.18);cursor:pointer;padding:8px 12px;color:#22E5E8;align-items:center;gap:6px;font-weight:700;font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase">
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>
        Menu
      </button>
    </nav>
  </div>
</header>

<div id="mob-menu" role="dialog" aria-label="Mobile navigation" aria-modal="true" style="display:none">
  <button class="mob-close" id="mob-close" aria-label="Close menu" style="position:absolute;top:18px;right:22px;background:none;border:none;color:#7E8A99;cursor:pointer;font-size:0.85rem;letter-spacing:0.1em">[×] CLOSE</button>
  <a href="#features" class="mob-link">Modules</a>
  <a href="#how-it-works" class="mob-link">How It Works</a>
  <a href="#open-source" class="mob-link">Open Source</a>
  <a href="/upload" class="mob-link">Upload</a>
  <div style="margin-top:auto;display:flex;flex-direction:column;gap:12px;padding-top:40px">
    <a href="${GITHUB}" class="btn btn-cyber" style="justify-content:center" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a href="/upload" class="btn btn-fill" style="justify-content:center">Launch App</a>
  </div>
</div>

<!-- MAIN -->
<main id="main-content">
  <!-- HERO -->
  <section class="hero-section grid-bg scanlines" style="padding:126px 0 90px;position:relative;overflow:hidden;background:#05070A" aria-labelledby="hero-heading">
    <div class="hero-scan" aria-hidden="true"></div>
    <div aria-hidden="true" style="position:absolute;top:16%;right:3%;width:440px;height:440px;border-radius:50%;background:radial-gradient(circle,rgba(157,107,255,0.08) 0%,transparent 64%);pointer-events:none"></div>
    <div class="wrap" style="position:relative;z-index:3">
      <div class="hero-grid" style="display:grid;grid-template-columns:1.05fr 0.95fr;gap:60px;align-items:center">
        <div>
          <div class="ha1" style="font-size:0.7rem;letter-spacing:0.12em;margin-bottom:26px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span style="color:#22E5E8">[SYSTEM ONLINE]</span>
            <span style="color:#3A4452">//</span>
            <span style="color:#7E8A99">AI INVENTORY INTELLIGENCE</span>
            <span style="color:#3A4452">//</span>
            <span style="color:#9D6BFF;animation:prp-neonPulse 2.5s ease-in-out infinite">CLAUDE: ACTIVE</span>
          </div>
          <h1 id="hero-heading" class="ha2" style="font-weight:800;font-size:clamp(2.3rem,4.6vw,3.9rem);line-height:1.04;letter-spacing:0.01em;text-transform:uppercase;color:#E6EDF3;margin-bottom:8px">
            <span class="glitch" data-text="Stop Guessing." style="display:inline-block">Stop Guessing.</span><br>
            <span style="display:block;color:#E6EDF3">Start Selling</span>
            <span style="display:block;background:linear-gradient(120deg,#22E5E8,#5BEEF0);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">Smarter.<span class="cursor" style="-webkit-text-fill-color:#22E5E8">▌</span></span>
          </h1>
          <p class="ha3" style="font-size:0.86rem;line-height:1.85;color:#7E8A99;max-width:470px;margin:26px 0 36px;border-left:2px solid #9D6BFF;padding-left:16px">
            AI-powered inventory intelligence for retail. Upload a CSV or connect Google Sheets — Claude AI analyzes your stock, forecasts demand, and surfaces what actually matters.
          </p>
          <div class="hero-btns ha4" style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:46px">
            <a href="/upload" class="btn btn-fill">
              Launch App
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </a>
            <a href="${GITHUB}" class="btn btn-cyber" target="_blank" rel="noopener noreferrer">View Source</a>
            <a href="#how-it-works" class="btn btn-violet">How It Works</a>
          </div>
          <div class="ha5">
            <div style="font-size:0.64rem;letter-spacing:0.14em;text-transform:uppercase;color:#3A4452;margin-bottom:8px">// Required CSV columns</div>
            <div class="req-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:520px">
              <div class="term"><span class="p">$</span> <span class="c">inventory</span><br><span class="a">SKU · Cost · Price · Current_Stock</span></div>
              <div class="term v"><span style="color:#22E5E8">$</span> <span style="color:#E6EDF3">sales_history</span><br><span style="color:#9D6BFF">Date · SKU · Sales</span></div>
            </div>
          </div>
        </div>
        <!-- Mockup -->
        <div class="mockup-wrap ha5" role="img" aria-label="Precision Retail Pro dashboard mockup with KPIs, a weekly sales chart, and an AI recommendation.">
          <div style="background:#0A0E15;border:1px solid rgba(34,229,232,0.2);box-shadow:0 0 50px rgba(34,229,232,0.07),inset 0 0 60px rgba(34,229,232,0.015);position:relative">
            <div aria-hidden="true" style="position:absolute;top:-1px;left:-1px;width:15px;height:15px;border-top:2px solid #22E5E8;border-left:2px solid #22E5E8"></div>
            <div aria-hidden="true" style="position:absolute;bottom:-1px;right:-1px;width:15px;height:15px;border-bottom:2px solid #9D6BFF;border-right:2px solid #9D6BFF"></div>
            <div style="background:#070A10;padding:10px 15px;border-bottom:1px solid rgba(34,229,232,0.1);display:flex;align-items:center;justify-content:space-between">
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:7px;height:7px;background:#9D6BFF"></div>
                <span style="font-weight:700;font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:#22E5E8">Dashboard</span>
              </div>
              <span style="font-size:0.54rem;letter-spacing:0.08em;color:#3A4452">SYNCED 2m</span>
            </div>
            <div style="padding:15px">
              <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:8px">
                <div style="border:1px solid rgba(34,229,232,0.14);padding:11px;background:#05070A">
                  <div style="font-size:0.48rem;letter-spacing:0.1em;text-transform:uppercase;color:#3A4452;margin-bottom:5px">Stock Value</div>
                  <div style="font-weight:800;font-size:0.98rem;color:#E6EDF3">$124,580</div>
                  <div style="font-size:0.48rem;color:#22E5E8;margin-top:2px">▲ 8.3%</div>
                </div>
                <div style="border:1px solid rgba(34,229,232,0.14);padding:11px;background:#05070A">
                  <div style="font-size:0.48rem;letter-spacing:0.1em;text-transform:uppercase;color:#3A4452;margin-bottom:5px">SKUs</div>
                  <div style="font-weight:800;font-size:0.98rem;color:#E6EDF3">847</div>
                  <div style="font-size:0.48rem;color:#3A4452;margin-top:2px">all categories</div>
                </div>
                <div style="border:1px solid rgba(157,107,255,0.28);padding:11px;background:#05070A">
                  <div style="font-size:0.48rem;letter-spacing:0.1em;text-transform:uppercase;color:#3A4452;margin-bottom:5px">Low Stock</div>
                  <div style="font-weight:800;font-size:0.98rem;color:#9D6BFF">12</div>
                  <div style="font-size:0.48rem;color:#9D6BFF;margin-top:2px">action req'd</div>
                </div>
                <div style="border:1px solid rgba(34,229,232,0.3);padding:11px;background:rgba(34,229,232,0.05)">
                  <div style="font-size:0.48rem;letter-spacing:0.1em;text-transform:uppercase;color:#3A4452;margin-bottom:5px">Avg Margin</div>
                  <div style="font-weight:800;font-size:0.98rem;color:#22E5E8">34.2%</div>
                  <div style="font-size:0.48rem;color:#22E5E8;margin-top:2px">▲ 2.1%</div>
                </div>
              </div>
              <div style="border:1px solid rgba(34,229,232,0.14);padding:12px;background:#05070A;margin-bottom:8px">
                <div style="font-size:0.52rem;letter-spacing:0.08em;text-transform:uppercase;color:#7E8A99;margin-bottom:9px">Weekly Sales</div>
                <div style="display:flex;align-items:flex-end;gap:5px;height:48px">
                  <div class="bar-col" style="flex:1;background:rgba(34,229,232,0.32);height:55%"></div>
                  <div class="bar-col" style="flex:1;background:rgba(34,229,232,0.32);height:72%"></div>
                  <div class="bar-col" style="flex:1;background:rgba(34,229,232,0.32);height:46%"></div>
                  <div class="bar-col" style="flex:1;background:#22E5E8;height:100%;box-shadow:0 0 10px rgba(34,229,232,0.6)"></div>
                  <div class="bar-col" style="flex:1;background:rgba(34,229,232,0.32);height:66%"></div>
                  <div class="bar-col" style="flex:1;background:rgba(34,229,232,0.32);height:85%"></div>
                  <div class="bar-col" style="flex:1;background:rgba(157,107,255,0.4);height:72%;border:1px dashed rgba(157,107,255,0.5)"></div>
                </div>
              </div>
              <div style="border:1px solid rgba(157,107,255,0.22);padding:9px 12px;background:rgba(157,107,255,0.04);display:flex;align-items:center;gap:8px">
                <span style="font-weight:700;font-size:0.56rem;letter-spacing:0.08em;color:#9D6BFF;flex-shrink:0">AI ›</span>
                <span style="font-size:0.54rem;color:#7E8A99;line-height:1.4">Running Shoes sells out in ~6 days. Reorder recommended.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <hr class="neon-line" aria-hidden="true">

  <!-- MODULES -->
  <section id="features" class="sec-pad" style="padding:84px 0;background:#05070A" aria-labelledby="features-heading">
    <div class="wrap">
      <header style="margin-bottom:50px">
        <span class="sec-tag sr">What it does</span>
        <h2 id="features-heading" class="sec-h2 sr d1" style="margin-bottom:14px">Four modules.<br><em>Zero guesswork.</em></h2>
        <p class="sec-body sr d2">Every view answers one question retail owners actually ask. No dashboards for the sake of dashboards.</p>
      </header>
      <div class="feats-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
        <article class="hud-card sr d1">
          <div style="display:flex;align-items:flex-start;gap:16px">
            <div style="width:38px;height:38px;border:1px solid rgba(34,229,232,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#22E5E8">
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2" y="2" width="16" height="16" rx="1" stroke="currentColor" stroke-width="1.5"></rect><path d="M6 13l3-3.5 2 2.5 3-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </div>
            <div>
              <h3 style="font-weight:700;font-size:0.96rem;letter-spacing:0.08em;text-transform:uppercase;color:#E6EDF3;margin-bottom:9px">Dashboard</h3>
              <p style="font-size:0.8rem;line-height:1.75;color:#7E8A99">Stock value, SKU count, low-stock alerts, and average margin — calculated live from your uploaded data.</p>
              <a href="/dashboard" style="display:inline-flex;align-items:center;gap:6px;margin-top:13px;font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:#22E5E8">Open Dashboard →</a>
            </div>
          </div>
        </article>
        <article class="hud-card sr d2">
          <div style="display:flex;align-items:flex-start;gap:16px">
            <div style="width:38px;height:38px;border:1px solid rgba(34,229,232,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#22E5E8">
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2" y="2" width="7" height="7" rx="0.5" stroke="currentColor" stroke-width="1.5"></rect><rect x="11" y="2" width="7" height="7" rx="0.5" stroke="currentColor" stroke-width="1.5"></rect><rect x="2" y="11" width="7" height="7" rx="0.5" stroke="currentColor" stroke-width="1.5"></rect><rect x="11" y="11" width="7" height="7" rx="0.5" stroke="currentColor" stroke-width="1.5"></rect></svg>
            </div>
            <div>
              <h3 style="font-weight:700;font-size:0.96rem;letter-spacing:0.08em;text-transform:uppercase;color:#E6EDF3;margin-bottom:9px">Inventory Grid</h3>
              <p style="font-size:0.8rem;line-height:1.75;color:#7E8A99">Every SKU in a searchable, sortable grid. Cost, price, stock level, ABC class, and margin per product.</p>
              <a href="/inventory" style="display:inline-flex;align-items:center;gap:6px;margin-top:13px;font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:#22E5E8">Open Grid →</a>
            </div>
          </div>
        </article>
        <article class="hud-card violet sr d3">
          <div style="display:flex;align-items:flex-start;gap:16px">
            <div style="width:38px;height:38px;border:1px solid rgba(157,107,255,0.35);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#9D6BFF">
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2.5l2.3 4.7 5.2.75-3.75 3.65.88 5.15L10 14.4l-4.63 2.35.88-5.15L2.5 7.95l5.2-.75L10 2.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>
            </div>
            <div>
              <h3 style="font-weight:700;font-size:0.96rem;letter-spacing:0.08em;text-transform:uppercase;color:#E6EDF3;margin-bottom:9px">AI Forecast</h3>
              <p style="font-size:0.8rem;line-height:1.75;color:#7E8A99">Claude AI reads your sales history and forecasts demand — which products to reorder, reduce, or watch.</p>
              <a href="/forecasting" style="display:inline-flex;align-items:center;gap:6px;margin-top:13px;font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:#9D6BFF">Open Forecast →</a>
            </div>
          </div>
        </article>
        <article class="hud-card sr d4">
          <div style="display:flex;align-items:flex-start;gap:16px">
            <div style="width:38px;height:38px;border:1px solid rgba(34,229,232,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#22E5E8">
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 12V16a.75.75 0 00.75.75h10.5A.75.75 0 0016 16v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M10 3.5v9M7.5 6l2.5-2.5 2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </div>
            <div>
              <h3 style="font-weight:700;font-size:0.96rem;letter-spacing:0.08em;text-transform:uppercase;color:#E6EDF3;margin-bottom:9px">Data Import</h3>
              <p style="font-size:0.8rem;line-height:1.75;color:#7E8A99">Drag-and-drop CSV or paste a Google Sheets URL. No API keys, no connectors, no IT department.</p>
              <a href="/upload" style="display:inline-flex;align-items:center;gap:6px;margin-top:13px;font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:#22E5E8">Upload Data →</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <hr class="neon-line" aria-hidden="true">

  <!-- HOW IT WORKS -->
  <section id="how-it-works" class="sec-pad grid-bg" style="padding:84px 0;background:#0A0E15;position:relative;overflow:hidden" aria-labelledby="hiw-heading">
    <div class="wrap" style="position:relative;z-index:1">
      <header style="margin-bottom:50px">
        <span class="sec-tag sr">How it works</span>
        <h2 id="hiw-heading" class="sec-h2 sr d1">Three commands.<br><em>Full picture.</em></h2>
      </header>
      <div class="steps-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        <div class="sr d1" style="padding:26px 22px;border:1px solid rgba(34,229,232,0.16);background:#05070A">
          <div style="font-size:0.6rem;letter-spacing:0.14em;color:#3A4452;margin-bottom:16px">STEP 01</div>
          <h3 style="font-weight:700;font-size:0.92rem;letter-spacing:0.08em;text-transform:uppercase;color:#E6EDF3;margin-bottom:10px">Upload Data</h3>
          <p style="font-size:0.78rem;line-height:1.75;color:#7E8A99;margin-bottom:14px">Drop your CSV files or paste a Google Sheets link. Inventory file and sales history — that's it.</p>
          <div class="term"><span class="p">›</span> <span class="c">upload</span> <span class="a">inventory.csv</span><br><span class="p">›</span> <span class="c">upload</span> <span class="a">sales.csv</span></div>
        </div>
        <div class="sr d2" style="padding:26px 22px;border:1px solid rgba(157,107,255,0.2);background:#05070A">
          <div style="font-size:0.6rem;letter-spacing:0.14em;color:#3A4452;margin-bottom:16px">STEP 02</div>
          <h3 style="font-weight:700;font-size:0.92rem;letter-spacing:0.08em;text-transform:uppercase;color:#E6EDF3;margin-bottom:10px">AI Analysis</h3>
          <p style="font-size:0.78rem;line-height:1.75;color:#7E8A99;margin-bottom:14px">Claude AI scans your sales patterns, identifies fast and slow movers, and generates demand forecasts.</p>
          <div class="term v"><span style="color:#9D6BFF">›</span> <span style="color:#E6EDF3">ai analyze</span> <span style="color:#9D6BFF">--model claude</span><br><span style="color:#22E5E8">✓ analysis complete</span></div>
        </div>
        <div class="sr d3" style="padding:26px 22px;border:1px solid rgba(34,229,232,0.16);background:#05070A">
          <div style="font-size:0.6rem;letter-spacing:0.14em;color:#3A4452;margin-bottom:16px">STEP 03</div>
          <h3 style="font-weight:700;font-size:0.92rem;letter-spacing:0.08em;text-transform:uppercase;color:#E6EDF3;margin-bottom:10px">Act on Insights</h3>
          <p style="font-size:0.78rem;line-height:1.75;color:#7E8A99;margin-bottom:14px">Your dashboard populates with margins, forecasts, low-stock alerts, and AI recommendations.</p>
          <div class="term"><span class="p">›</span> <span class="c">view</span> <span class="a">--dashboard --live</span><br><span style="color:#22E5E8">✓ 847 SKUs loaded</span></div>
        </div>
      </div>
    </div>
  </section>

  <hr class="neon-line" aria-hidden="true">

  <!-- OPEN SOURCE -->
  <section id="open-source" class="sec-pad" style="padding:84px 0;background:#05070A" aria-labelledby="oss-heading">
    <div class="wrap">
      <div class="oss-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center">
        <div class="sr">
          <span class="sec-tag">Open source</span>
          <h2 id="oss-heading" class="sec-h2 sr d1" style="margin-bottom:20px">Free. Open.<br><em>Community-driven.</em></h2>
          <p class="sec-body sr d2" style="margin-bottom:28px">Precision Retail Pro is fully open source. Inspect the code, self-host it, fork it, contribute. No black boxes — not in the UI, not in the AI.</p>
          <div class="sr d3" style="display:flex;gap:12px;flex-wrap:wrap">
            <a href="${GITHUB}" class="btn btn-cyber" target="_blank" rel="noopener noreferrer">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
              View on GitHub
            </a>
            <a href="/upload" class="btn btn-fill">Launch App</a>
          </div>
        </div>
        <div class="sr d1">
          <div style="background:#0A0E15;border:1px solid rgba(34,229,232,0.16);padding:26px;position:relative">
            <div aria-hidden="true" style="position:absolute;top:-1px;right:-1px;width:13px;height:13px;border-top:2px solid #9D6BFF;border-right:2px solid #9D6BFF"></div>
            <div style="font-size:0.64rem;letter-spacing:0.14em;text-transform:uppercase;color:#3A4452;margin-bottom:16px">// Stack</div>
            <ul role="list">
              <li style="display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid rgba(34,229,232,0.07)"><span style="font-size:0.78rem;color:#7E8A99">Frontend</span><span style="font-size:0.74rem;color:#22E5E8">Next.js</span></li>
              <li style="display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid rgba(34,229,232,0.07)"><span style="font-size:0.78rem;color:#7E8A99">AI Engine</span><span style="font-size:0.74rem;color:#9D6BFF">Anthropic Claude</span></li>
              <li style="display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid rgba(34,229,232,0.07)"><span style="font-size:0.78rem;color:#7E8A99">Data sources</span><span style="font-size:0.74rem;color:#22E5E8">CSV · Google Sheets</span></li>
              <li style="display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid rgba(34,229,232,0.07)"><span style="font-size:0.78rem;color:#7E8A99">Deployment</span><span style="font-size:0.74rem;color:#22E5E8">Vercel</span></li>
              <li style="display:flex;justify-content:space-between;align-items:center;padding:11px 0"><span style="font-size:0.78rem;color:#7E8A99">License</span><span style="font-size:0.74rem;color:#9D6BFF">MIT</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<hr class="neon-line" aria-hidden="true">

<!-- FOOTER -->
<footer role="contentinfo" style="background:#0A0E15;padding:46px 0 30px;border-top:1px solid rgba(34,229,232,0.1)">
  <div class="wrap">
    <div class="footer-grid" style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px;margin-bottom:38px">
      <div class="footer-brand">
        <a href="/" aria-label="Precision Retail Pro — Homepage" style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <svg width="22" height="22" viewBox="0 0 26 26" fill="none" aria-hidden="true"><path d="M14 2L6 15h6l-2 9 10-14h-7l1-8z" fill="#22E5E8" stroke="#22E5E8" stroke-width="0.5" stroke-linejoin="round"></path></svg>
          <span style="font-weight:800;font-size:0.82rem;letter-spacing:0.12em;text-transform:uppercase;color:#E6EDF3">Precision<span style="color:#22E5E8"> Retail</span></span>
        </a>
        <p style="font-size:0.76rem;line-height:1.7;color:#52606E;max-width:250px">Open-source AI inventory intelligence. Powered by Claude. Built for retail.</p>
      </div>
      <nav aria-label="App navigation">
        <h3 style="font-size:0.62rem;letter-spacing:0.14em;text-transform:uppercase;color:#3A4452;margin-bottom:16px">// App</h3>
        <ul role="list" style="display:flex;flex-direction:column;gap:11px">
          <li><a href="/upload" style="font-size:0.78rem;color:#7E8A99">Upload Data</a></li>
          <li><a href="/dashboard" style="font-size:0.78rem;color:#7E8A99">Dashboard</a></li>
          <li><a href="/inventory" style="font-size:0.78rem;color:#7E8A99">Inventory Grid</a></li>
          <li><a href="/forecasting" style="font-size:0.78rem;color:#7E8A99">AI Forecast</a></li>
        </ul>
      </nav>
      <nav aria-label="Project navigation">
        <h3 style="font-size:0.62rem;letter-spacing:0.14em;text-transform:uppercase;color:#3A4452;margin-bottom:16px">// Project</h3>
        <ul role="list" style="display:flex;flex-direction:column;gap:11px">
          <li><a href="${GITHUB}" style="font-size:0.78rem;color:#7E8A99" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href="#how-it-works" style="font-size:0.78rem;color:#7E8A99">Documentation</a></li>
          <li><a href="#open-source" style="font-size:0.78rem;color:#7E8A99">Contribute</a></li>
        </ul>
      </nav>
    </div>
    <div style="border-top:1px solid rgba(34,229,232,0.07);padding-top:22px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <p style="font-size:0.68rem;letter-spacing:0.04em;color:#3A4452">© 2026 Precision Retail Pro · MIT License</p>
      <p style="font-size:0.68rem;letter-spacing:0.04em;color:#3A4452">Built with <span style="color:#9D6BFF">♥</span> + <span style="color:#22E5E8">Claude AI</span></p>
    </div>
  </div>
</footer>
`;

export default function LandingPage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    // Header border on scroll
    const header = document.getElementById("site-header");
    const onScroll = () => {
      if (header)
        header.style.borderBottomColor =
          window.scrollY > 10 ? "rgba(34,229,232,0.22)" : "rgba(34,229,232,0.12)";
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Scroll reveal
    const els = Array.from(document.querySelectorAll<HTMLElement>(".lp .sr"));
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              observer?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
      );
      els.forEach((el) => observer!.observe(el));
    } else {
      els.forEach((el) => el.classList.add("in"));
    }

    // Mobile menu
    const hamBtn = document.getElementById("ham-btn");
    const mobMenu = document.getElementById("mob-menu");
    const mobClose = document.getElementById("mob-close");
    const open = () => {
      if (!mobMenu || !hamBtn) return;
      mobMenu.style.display = "flex";
      mobMenu.style.flexDirection = "column";
      mobMenu.style.position = "fixed";
      mobMenu.style.inset = "0";
      mobMenu.style.background = "#05070A";
      mobMenu.style.zIndex = "999";
      mobMenu.style.padding = "78px 28px 36px";
      hamBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      if (!mobMenu || !hamBtn) return;
      mobMenu.style.display = "none";
      hamBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    hamBtn?.addEventListener("click", open);
    mobClose?.addEventListener("click", close);
    mobMenu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      hamBtn?.removeEventListener("click", open);
      mobClose?.removeEventListener("click", close);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="lp" style={{ background: "#05070A", minHeight: "100vh" }} dangerouslySetInnerHTML={{ __html: LANDING_HTML }} />
  );
}
