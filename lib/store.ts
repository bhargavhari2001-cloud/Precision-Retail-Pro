"use client";

import { create } from "zustand";
import type { AppState, InventoryRow, SalesRow, AnalyzeResponse } from "@/types";
import { storage } from "@/lib/storage";

export const useStore = create<AppState>((set) => ({
  inventoryData: null,
  salesData: null,
  analysisResult: null,
  isAnalyzing: false,
  lastAnalyzedAt: null,

  setInventoryData: (data: InventoryRow[]) => {
    storage.saveInventory(data);
    set({ inventoryData: data });
  },
  setSalesData: (data: SalesRow[]) => {
    storage.saveSales(data);
    set({ salesData: data });
  },
  setAnalysisResult: (result: AnalyzeResponse) => {
    storage.saveAnalysis(result);
    set({ analysisResult: result, lastAnalyzedAt: new Date().toISOString() });
  },
  setIsAnalyzing: (v: boolean) => set({ isAnalyzing: v }),
  clearAll: () => {
    storage.clearAll();
    set({ inventoryData: null, salesData: null, analysisResult: null, lastAnalyzedAt: null });
  },
}));
