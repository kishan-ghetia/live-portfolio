import { usePriceStore } from "../store/priceStore";
import type { Quote } from "../types/market";
import { createFakeSocket } from "../test/fakeSocket";
import { startFeedBridge } from "./feedBridge";

const tcs: Quote = {
  symbol: "TCS",
  ltp: 246000,
  prevClose: 237620,
  open: null,
  high: null,
  low: null,
  volume: null,
  seq: 0,
};

beforeEach(() => {
  jest.useFakeTimers();
  usePriceStore.getState().resetState();
  usePriceStore.getState().setState({ quotes: { TCS: tcs }, status: "ready" });
});
afterEach(() => jest.useRealTimers());

// Ticks are held back and written together every 100ms, not one store update per tick.
test("ticks are batched into one store update every 100ms", () => {
  const { socket, send } = createFakeSocket();
  startFeedBridge(socket);

  send({ symbol: "TCS", seq: 1, ltp: 246500 });
  send({ symbol: "TCS", seq: 2, ltp: 246800 });
  expect(usePriceStore.getState().quotes.TCS?.ltp).toBe(246000);

  jest.advanceTimersByTime(100);
  expect(usePriceStore.getState().quotes.TCS?.ltp).toBe(246800);
});

// After stop, ticks are no longer received or written.
test("stop unsubscribes and stops writing", () => {
  const { socket, send } = createFakeSocket();
  const stop = startFeedBridge(socket);

  stop();
  send({ symbol: "TCS", seq: 1, ltp: 246500 });
  jest.advanceTimersByTime(100);

  expect(usePriceStore.getState().quotes.TCS?.ltp).toBe(246000);
});

// Further tests that could be added:
//
// 1. A batch of only late ticks doesn't touch the store
//    - The store's quotes object stays the same reference, so no screen re-renders.
//
// 2. Ticks after a flush go into the next batch
//    - A tick arriving at 150ms is written at 200ms, not lost.
