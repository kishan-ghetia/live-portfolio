import { useMemo, useState } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import { usePriceStore } from "../store/priceStore";
import type { PortfolioSummary } from "../types/portfolio";
import { calcSummary } from "../utils/pnl";
import { type SortKey, sortHoldings } from "../utils/sortHoldings";

export type PortfolioLoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; symbols: string[] };

export function usePortfolioViewModel() {
  const holdings = usePortfolioStore((s) => s.holdings);
  const status = usePriceStore((s) => s.status);
  const error = usePriceStore((s) => s.error);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");

  const symbols = useMemo(() => {
    if (status !== "ready") return [];
    const sorted = sortHoldings(holdings, usePriceStore.getState().quotes, sortBy);
    const search = query.trim().toUpperCase();
    return search ? sorted.filter((symbol) => symbol.includes(search)) : sorted;
  }, [holdings, status, sortBy, query]);

  let state: PortfolioLoadState;
  if (status === "error") state = { status, message: error ?? "Something went wrong" };
  else if (status === "ready") state = { status, symbols };
  else state = { status };

  return { state, query, setQuery, sortBy, setSortBy };
}

export function usePortfolioSummary(): PortfolioSummary {
  const holdings = usePortfolioStore((s) => s.holdings);
  const quotes = usePriceStore((s) => s.quotes);
  return useMemo(() => calcSummary(holdings, quotes), [holdings, quotes]);
}
