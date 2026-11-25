import type { QuoteMap, Tick } from "../types/market";
import type { PriceSocket, TickHandler } from "./priceSocket";

const TICK_INTERVAL_MS = 50;
const MAX_CHANGE_PER_TICK = 0.002;
const VOLUME_CHANCE = 0.3;

interface SymbolState {
  ltp: number;
  high: number;
  low: number;
  volume: number;
  seq: number;
}

export function createSimulatedSocket(
  getQuotes: () => QuoteMap,
  random: () => number = Math.random,
): PriceSocket {
  const handlers = new Set<TickHandler>();
  const states = new Map<string, SymbolState>();
  let timer: ReturnType<typeof setInterval> | null = null;

  function seed() {
    for (const quote of Object.values(getQuotes())) {
      if (!quote) continue;
      states.set(quote.symbol, {
        ltp: quote.ltp,
        high: quote.high ?? quote.ltp,
        low: quote.low ?? quote.ltp,
        volume: quote.volume ?? 0,
        seq: states.get(quote.symbol)?.seq ?? 0,
      });
    }
  }

  function pick<T>(items: T[]): T {
    return items[Math.floor(random() * items.length)];
  }

  function nextTick(): Tick | null {
    if (states.size === 0) return null;

    const [symbol, state] = pick([...states.entries()]);
    const move = (random() * 2 - 1) * MAX_CHANGE_PER_TICK;
    state.ltp = Math.max(1, Math.round(state.ltp * (1 + move)));
    state.seq += 1;

    const tick: Tick = { symbol, seq: state.seq, ltp: state.ltp };
    if (state.ltp > state.high) {
      state.high = state.ltp;
      tick.high = state.ltp;
    }
    if (state.ltp < state.low) {
      state.low = state.ltp;
      tick.low = state.ltp;
    }
    if (random() < VOLUME_CHANCE) {
      state.volume += 100 + Math.floor(random() * 5000);
      tick.volume = state.volume;
    }
    return tick;
  }

  function onInterval() {
    const tick = nextTick();
    if (!tick) return;
    for (const handler of handlers) handler(tick);
  }

  return {
    connect() {
      if (timer) return;
      seed();
      timer = setInterval(onInterval, TICK_INTERVAL_MS);
    },
    disconnect() {
      if (timer) clearInterval(timer);
      timer = null;
    },
    onTick(handler) {
      handlers.add(handler);
      return () => {
        handlers.delete(handler);
      };
    },
  };
}
