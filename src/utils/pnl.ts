import type { Quote, QuoteMap } from "../types/market";
import type { Holding, HoldingValues, PortfolioSummary } from "../types/portfolio";

function percent(part: number, whole: number): number {
  return whole === 0 ? 0 : (part / whole) * 100;
}

export function calcHolding(holding: Holding, quote: Quote | undefined): HoldingValues | null {
  if (!quote) return null;

  const valuePaise = holding.qty * quote.ltp;
  const pnlPaise = valuePaise - holding.investedPaise;
  const dayChangePaise = holding.qty * (quote.ltp - quote.prevClose);

  return {
    valuePaise,
    pnlPaise,
    pnlPct: percent(pnlPaise, holding.investedPaise),
    dayChangePaise,
  };
}

export function calcSummary(holdings: Holding[], quotes: QuoteMap): PortfolioSummary {
  let investedPaise = 0;
  let valuePaise = 0;
  let pnlPaise = 0;
  let dayChangePaise = 0;
  const unpricedSymbols: string[] = [];

  for (const holding of holdings) {
    const row = calcHolding(holding, quotes[holding.symbol]);
    if (!row) {
      unpricedSymbols.push(holding.symbol);
      continue;
    }
    investedPaise += holding.investedPaise;
    valuePaise += row.valuePaise;
    pnlPaise += row.pnlPaise;
    dayChangePaise += row.dayChangePaise;
  }

  return {
    investedPaise,
    valuePaise,
    pnlPaise,
    pnlPct: percent(pnlPaise, investedPaise),
    dayChangePaise,
    dayChangePct: percent(dayChangePaise, valuePaise - dayChangePaise),
    unpricedSymbols,
  };
}
