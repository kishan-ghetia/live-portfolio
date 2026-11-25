import { useMemo } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import { usePriceStore } from "../store/priceStore";
import type { Holding, HoldingValues, PortfolioSummary } from "../types/portfolio";
import { calcHolding, calcSummary } from "../utils/pnl";

export interface PortfolioRow {
  holding: Holding;
  values: HoldingValues | null;
}

export type PortfolioLoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; rows: PortfolioRow[]; summary: PortfolioSummary };

export function usePortfolioViewModel(): PortfolioLoadState {
  const holdings = usePortfolioStore((s) => s.holdings);
  const status = usePriceStore((s) => s.status);
  const error = usePriceStore((s) => s.error);
  const quotes = usePriceStore((s) => s.quotes);

  const portfolio = useMemo(() => {
    const rows = holdings.map((holding) => ({
      holding,
      values: calcHolding(holding, quotes[holding.symbol]),
    }));
    return { rows, summary: calcSummary(holdings, quotes) };
  }, [holdings, quotes]);

  if (status === "error") return { status, message: error ?? "Something went wrong" };
  if (status === "ready") return { status, ...portfolio };
  return { status };
}
