import type { Quote } from "../types/market";
import type { Holding } from "../types/portfolio";
import { sortHoldings } from "./sortHoldings";

const quote = (symbol: string, ltp: number): Quote => ({
  symbol,
  ltp,
  prevClose: ltp,
  open: null,
  high: null,
  low: null,
  volume: null,
  seq: 0,
});

const holdings: Holding[] = [
  { symbol: "BIG", qty: 10, investedPaise: 200000 },
  { symbol: "OLDCO", qty: 30, investedPaise: 1237500 },
  { symbol: "ALPHA", qty: 1, investedPaise: 5000 },
];
const quotes = { BIG: quote("BIG", 10000), ALPHA: quote("ALPHA", 9000) };

// Value: BIG is worth ₹1,000, ALPHA ₹90 → biggest first.
// OLDCO has no price, so it can't be ranked and always goes last (never treated as ₹0).
test("sorts by value, largest first, with unpriced holdings last", () => {
  expect(sortHoldings(holdings, quotes, "value")).toEqual(["BIG", "ALPHA", "OLDCO"]);
});

// P&L: ALPHA made +₹40, BIG lost −₹1,000 → best first; name sort is A–Z. OLDCO last in both.
test("sorts by P&L best first and by name A–Z, unpriced last", () => {
  expect(sortHoldings(holdings, quotes, "pnl")).toEqual(["ALPHA", "BIG", "OLDCO"]);
  expect(sortHoldings(holdings, quotes, "name")).toEqual(["ALPHA", "BIG", "OLDCO"]);
});

// Further tests that could be added:
//
// 1. Ties keep a stable order
//    - Two holdings with equal value stay in their original order.
//
// 2. Empty holdings return an empty list
