import type { Quote } from "../types/market";
import { applyTick } from "./applyTick";

const tcs: Quote = {
  symbol: "TCS",
  ltp: 246000,
  prevClose: 237620,
  open: 238000,
  high: 247000,
  low: 237500,
  volume: 1000,
  seq: 5,
};

// A tick only carries changed fields: ltp moves, seq updates, everything else stays.
test("a newer partial tick updates only its own fields", () => {
  expect(applyTick(tcs, { symbol: "TCS", seq: 6, ltp: 246500 })).toEqual({
    ...tcs,
    ltp: 246500,
    seq: 6,
  });
});

// seq 4 or a repeated seq 5 arrived after seq 5, so it's old and must be ignored.
// Returning the exact same object (toBe) lets React skip re-rendering that row.
test("a late or repeated tick is ignored and returns the same object", () => {
  expect(applyTick(tcs, { symbol: "TCS", seq: 4, ltp: 1 })).toBe(tcs);
  expect(applyTick(tcs, { symbol: "TCS", seq: 5, ltp: 1 })).toBe(tcs);
});

// No quote (e.g. OLDCO) means nothing to update: it stays unpriced, never invented from a tick.
test("a tick for a symbol without a quote is ignored", () => {
  expect(applyTick(undefined, { symbol: "OLDCO", seq: 1, ltp: 41250 })).toBeUndefined();
});

// Further tests that could be added:
//
// 1. high/low/volume from the tick replace the old values
//    - { seq: 6, high: 248000, volume: 1500 } updates those and keeps ltp.
//
// 2. The original quote is never mutated
//    - After a newer tick, the old object still has its old ltp and seq.
