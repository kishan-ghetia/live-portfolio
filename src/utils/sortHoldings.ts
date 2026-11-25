import type { QuoteMap } from "../types/market";
import type { Holding } from "../types/portfolio";
import { calcHolding } from "./pnl";

export type SortKey = "name" | "value" | "pnl";

export function sortHoldings(holdings: Holding[], quotes: QuoteMap, sortBy: SortKey): string[] {
  const rows = holdings.map((holding) => ({
    symbol: holding.symbol,
    values: calcHolding(holding, quotes[holding.symbol]),
  }));

  rows.sort((a, b) => {
    if (!a.values || !b.values) return (a.values ? 0 : 1) - (b.values ? 0 : 1);
    if (sortBy === "value") return b.values.valuePaise - a.values.valuePaise;
    if (sortBy === "pnl") return b.values.pnlPaise - a.values.pnlPaise;
    return a.symbol.localeCompare(b.symbol);
  });

  return rows.map((row) => row.symbol);
}
