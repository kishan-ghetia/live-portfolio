import type { Quote, QuoteMap, Tick } from "../types/market";

export function applyTick(
  quote: Quote | undefined,
  tick: Tick,
): Quote | undefined {
  if (!quote || tick.seq <= quote.seq) return quote;

  return {
    ...quote,
    seq: tick.seq,
    ltp: tick.ltp ?? quote.ltp,
    high: tick.high ?? quote.high,
    low: tick.low ?? quote.low,
    volume: tick.volume ?? quote.volume,
  };
}

export function applyTicks(quotes: QuoteMap, ticks: Tick[]): QuoteMap {
  let next = quotes;
  for (const tick of ticks) {
    const current = next[tick.symbol];
    const updated = applyTick(current, tick);
    if (updated === current) continue;

    if (next === quotes) next = { ...quotes };
    next[tick.symbol] = updated;
  }
  return next;
}
