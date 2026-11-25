import type { Quote, Tick } from "../types/market";

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
