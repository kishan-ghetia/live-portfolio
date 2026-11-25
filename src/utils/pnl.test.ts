import type { Quote } from "../types/market";
import type { Holding } from "../types/portfolio";
import { calcHolding, calcSummary } from "./pnl";

const quote = (symbol: string, ltp: number, prevClose: number): Quote => ({
  symbol,
  ltp,
  prevClose,
  open: null,
  high: null,
  low: null,
  volume: null,
  seq: 0,
});

const gainer: Holding = { symbol: "GAIN", qty: 10, investedPaise: 100000 };
const loser: Holding = { symbol: "LOSS", qty: 5, investedPaise: 50000 };
const oldco: Holding = { symbol: "OLDCO", qty: 30, investedPaise: 1237500 };

// 10 shares bought for ₹1,000 total, now ₹120 each (yesterday ₹110):
// - value ₹1,200, P&L +₹200 (+20%), today +₹100
// - all in whole paise, so no rounding happens here
test("priced holding gets value, P&L and day change in paise", () => {
  expect(calcHolding(gainer, quote("GAIN", 12000, 11000))).toEqual({
    valuePaise: 120000,
    pnlPaise: 20000,
    pnlPct: 20,
    dayChangePaise: 10000,
  });
});

// No quote means we can't value it. Returning null (shown as "--")
// instead of 0 stops the row from showing a fake -100% loss.
test("holding without a quote returns null, never 0", () => {
  expect(calcHolding(oldco, undefined)).toBeNull();
});

// Summary covers priced holdings only:
// - OLDCO's ₹12,375 cost is left out of invested, so P&L % isn't dragged down by a stock we can't price
// - OLDCO is listed by name so the screen can say it was excluded
// - totals are sums of the row numbers, so the summary always matches the rows
test("summary excludes unpriced holdings and reconciles with the rows", () => {
  const quotes = { GAIN: quote("GAIN", 12000, 11000), LOSS: quote("LOSS", 9000, 10000) };
  const summary = calcSummary([gainer, loser, oldco], quotes);
  const gainRow = calcHolding(gainer, quotes.GAIN);
  const lossRow = calcHolding(loser, quotes.LOSS);

  expect(summary).toEqual({
    investedPaise: 150000,
    valuePaise: 165000,
    pnlPaise: 15000,
    pnlPct: 10,
    dayChangePaise: 5000,
    dayChangePct: 3.125,
    unpricedSymbols: ["OLDCO"],
  });
  expect(summary.pnlPaise).toBe((gainRow?.pnlPaise ?? 0) + (lossRow?.pnlPaise ?? 0));
});

// Further tests that could be added:
//
// 1. Empty portfolio or everything unpriced
//    - Totals are 0 and percentages are 0, not NaN from dividing by 0.
//
// 2. Day change % uses yesterday's value as the base
//    - A stock flat vs yesterday but in loss overall shows 0% today.
//
// 3. Bundled holdings with real API quotes
//    - Totals equal the sum of all 20 priced rows; only OLDCO is unpriced.
