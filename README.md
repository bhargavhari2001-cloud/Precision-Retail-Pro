# Precision Retail Pro

> AI-powered inventory intelligence for small to mid-sized retailers — rebuilt as a modern Next.js app with a cyberpunk aesthetic.

## What it does

- **Upload** inventory + sales CSVs via drag-and-drop
- **Analyse** stock levels using moving-average demand forecasting
- **Identify** dead stock (>90 DSI), urgent reorders (<14 DSI), and healthy SKUs
- **Forecast** 30-day demand per SKU using **Claude AI** (falls back to moving average when no API key is set)
- **View** all insights in a cyberpunk-styled executive dashboard

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| AI | Anthropic Claude (claude-sonnet-4-5) |
| Charts | Recharts |
| CSV Parsing | PapaParse |
| State | Zustand + localStorage |
| DB (optional) | Supabase |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
# Fill in your ANTHROPIC_API_KEY (required for AI forecasting)
# Supabase keys are optional for the core app
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Go to **Upload Data** — drag your CSVs onto the drop zones (or use the templates)
2. Click **Run AI Analysis** — metrics are computed instantly
3. Navigate to **Dashboard** for KPIs and action items
4. Open **Inventory Grid** to filter and search all SKUs
5. Visit **AI Forecast** to run a Claude-powered 30-day demand forecast per SKU

## CSV Format

**inventory.csv**
```
SKU,Cost,Price,Current_Stock
SKU-001,50.00,99.99,150
```

**sales_history.csv**
```
Date,SKU,Sales
2024-01-01,SKU-001,12
```

Column names are normalised automatically (e.g. `qty_sold` → `Sales`).

## Author

**Bhargav Hari** · [GitHub](https://github.com/bhargavhari)
