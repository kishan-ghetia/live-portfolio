import type { Quote, QuoteMap, Tick } from "../types/market";
import { createSimulatedSocket } from "./simulatedSocket";

const quote = (symbol: string, ltp: number): Quote => ({
  symbol,
  ltp,
  prevClose: ltp,
  open: null,
  high: null,
  low: null,
  volume: null,
});

const quotes: QuoteMap = { TCS: quote("TCS", 246000), INFY: quote("INFY", 152000) };
const onlyTcs: QuoteMap = { TCS: quote("TCS", 246000) };

function collect(getQuotes: () => QuoteMap, random?: () => number) {
  const socket = createSimulatedSocket(getQuotes, random);
  const ticks: Tick[] = [];
  socket.onTick((tick) => ticks.push(tick));
  return { socket, ticks };
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

// One tick every 50ms gives the ~20 ticks/second the brief asks for.
// After disconnect the timer is cleared, so nothing more arrives.
test("emits 20 ticks per second and stops on disconnect", () => {
  const { socket, ticks } = collect(() => quotes);

  socket.connect();
  jest.advanceTimersByTime(1000);
  expect(ticks).toHaveLength(20);

  socket.disconnect();
  jest.advanceTimersByTime(1000);
  expect(ticks).toHaveLength(20);
});

// random fixed at 0.7 makes every move +0.08%, so the test is predictable.
// Each tick moves ltp by at most 0.2% (plus paise rounding) and seq goes 1, 2, 3...
test("each tick moves price by at most 0.2% and seq increases per symbol", () => {
  const { socket, ticks } = collect(() => onlyTcs, () => 0.7);

  socket.connect();
  jest.advanceTimersByTime(250);

  let previous = 246000;
  ticks.forEach((tick, index) => {
    expect(tick.seq).toBe(index + 1);
    expect(Math.abs((tick.ltp ?? 0) - previous)).toBeLessThanOrEqual(previous * 0.002 + 0.5);
    previous = tick.ltp ?? 0;
  });
});

// Further tests that could be added:
//
// 1. Reconnect keeps seq counting up
//    - disconnect then connect continues from the last seq, so the store doesn't ignore new ticks.
//
// 2. Unsubscribe stops one handler only
//    - Other handlers keep receiving ticks.
