import type { QuoteMap, Tick } from "../types/market";
import type { PriceSocket, TickHandler } from "./priceSocket";

const TICK_INTERVAL_MS = 50; // 20 ticks per second
const MAX_CHANGE_PER_TICK = 0.002; // ±0.2%
const VOLUME_CHANCE = 0.3; // 30% of ticks change volume
const LATE_CHANCE = 0.02; // 2% of ticks are late
const ACTIVE_STEPS = 1200; // 60s of ticks (1200 × 50ms)
const SILENT_STEPS = 100; // then 5s of silence (100 × 50ms)

// Simulator's own memory of each stock
interface SymbolState {
  ltp: number;
  high: number;
  low: number;
  volume: number;
  seq: number;
}

// Fake socket: gets starting prices via getQuotes, random is swappable for tests
export function createSimulatedSocket(
  getQuotes: () => QuoteMap,
  random: () => number = Math.random,
): PriceSocket {
  const handlers = new Set<TickHandler>(); // functions to call on every tick
  const states = new Map<string, SymbolState>(); // per symbol: current price, seq
  const lastTicks = new Map<string, Tick>(); // per symbol: newest tick sent
  const olderTicks = new Map<string, Tick>(); // per symbol: the tick before that (resent as late)
  let timer: ReturnType<typeof setInterval> | null = null;
  let step = 0; // counts intervals, drives the silence cycle

  // Copy starting prices into memory; seq keeps counting across reconnects
  function seed() {
    for (const quote of Object.values(getQuotes())) {
      if (!quote) continue;
      states.set(quote.symbol, {
        ltp: quote.ltp,
        high: quote.high ?? quote.ltp,
        low: quote.low ?? quote.ltp,
        volume: quote.volume ?? 0,
        seq: states.get(quote.symbol)?.seq ?? quote.seq,
      });
    }
  }

  // Random item from a list
  function pick<T>(items: T[]): T {
    return items[Math.floor(random() * items.length)];
  }

  // New tick: random stock, price moves within ±0.2%, seq + 1
  function nextTick(): Tick | null {
    if (states.size === 0) return null;

    const [symbol, state] = pick([...states.entries()]);
    const move = (random() * 2 - 1) * MAX_CHANGE_PER_TICK; // -0.2% to +0.2%
    state.ltp = Math.max(1, Math.round(state.ltp * (1 + move))); // whole paise, never 0
    state.seq += 1;

    // Only changed fields go in the tick
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

    // Keep 2 historic ticks per symbol: previous newest moves to older
    const last = lastTicks.get(symbol);
    if (last) olderTicks.set(symbol, last);
    lastTicks.set(symbol, tick);
    return tick;
  }

  // Late tick: resend an older tick (old seq), the app must ignore it
  function lateTick(): Tick | null {
    const candidates = [...olderTicks.values()];
    return candidates.length > 0 ? { ...pick(candidates) } : null;
  }

  // Runs every 50ms: silent for 5s every minute, else 2% late tick or a new one, sent to every handler
  function onInterval() {
    // % repeats a 1300-step cycle: 0–1199 ticking, 1200–1299 silent, then back to 0
    const silent = step % (ACTIVE_STEPS + SILENT_STEPS) >= ACTIVE_STEPS;
    step += 1;
    if (silent) return;

    const tick = random() < LATE_CHANCE ? (lateTick() ?? nextTick()) : nextTick();
    if (!tick) return;
    for (const handler of handlers) handler(tick);
  }

  return {
    // Start ticking (ignored if already running)
    connect() {
      if (timer) return;
      seed();
      timer = setInterval(onInterval, TICK_INTERVAL_MS);
    },
    // Stop ticking
    disconnect() {
      if (timer) clearInterval(timer);
      timer = null;
    },
    // Add a listener, returns a function that removes it
    onTick(handler) {
      handlers.add(handler);
      return () => {
        handlers.delete(handler);
      };
    },
  };
}
