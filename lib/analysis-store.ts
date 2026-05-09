"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AnalysisRecord } from "@/lib/analysis-types";

type AnalysisStore = {
  current?: AnalysisRecord;
  localHistory: AnalysisRecord[];
  setCurrent: (record: AnalysisRecord) => void;
  clearCurrent: () => void;
};

export const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set) => ({
      localHistory: [],
      setCurrent: (record) =>
        set((state) => ({
          current: record,
          localHistory: [
            record,
            ...state.localHistory.filter((item) => item.id !== record.id),
          ].slice(0, 8),
        })),
      clearCurrent: () => set({ current: undefined }),
    }),
    {
      name: "cvlift-analysis",
      partialize: (state) => ({
        current: state.current,
        localHistory: state.localHistory,
      }),
    },
  ),
);
