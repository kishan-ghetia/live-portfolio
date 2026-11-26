import type { Holding } from "../types/portfolio";
import { calcAveragePaise } from "./pnl";
import { applyBuy, applySell, validateQty } from "./trade";

const tcs: Holding = { symbol: "TCS", qty: 40, investedPaise: 10358840 };

// Brief: "whole numbers above zero, and no selling more than you hold".
// Empty input is not an error yet (no message), it just can't be confirmed.
test("quantity must be a whole number above 0, and not more than held on a sell", () => {
  expect(validateQty("10", "buy", 0)).toEqual({ ok: true, qty: 10 });
  expect(validateQty(" 40 ", "sell", 40)).toEqual({ ok: true, qty: 40 });
  expect(validateQty("", "buy", 0)).toEqual({ ok: false, error: null });
  expect(validateQty("2.5", "buy", 0)).toEqual({ ok: false, error: "Enter a whole number" });
  expect(validateQty("-3", "buy", 0)).toEqual({ ok: false, error: "Enter a whole number" });
  expect(validateQty("0", "buy", 0)).toEqual({ ok: false, error: "Enter a quantity above 0" });
  expect(validateQty("41", "sell", 40)).toEqual({
    ok: false,
    error: "You hold 40. You can't sell more.",
  });
});

// Buying 10 TCS at ₹2,460 on top of 40 at avg ₹2,589.71:
// invested goes up by exactly the cost, so the average moves to ₹2,563.77 (rounded for display).
test("buy adds quantity and cost, so the average price changes", () => {
  const [after] = applyBuy([tcs], "TCS", 10, 246000);
  expect(after).toEqual({ symbol: "TCS", qty: 50, investedPaise: 12818840 });
  expect(calcAveragePaise(after)).toBeCloseTo(256376.8);
});

// Buying a stock you don't hold yet creates a new holding at the fill price.
test("buy of a new stock creates a holding", () => {
  expect(applyBuy([tcs], "INFY", 5, 150000)).toEqual([
    tcs,
    { symbol: "INFY", qty: 5, investedPaise: 750000 },
  ]);
});

// Selling keeps the average the same: invested shrinks in proportion to the shares sold.
// 3 shares bought for ₹10.00 total, sell 1 → ₹6.666… is rounded once to 667 paise.
test("sell keeps the average and rounds the remaining cost to whole paise", () => {
  const [after] = applySell([tcs], "TCS", 10);
  expect(after).toEqual({ symbol: "TCS", qty: 30, investedPaise: 7769130 });
  expect(calcAveragePaise(after)).toBeCloseTo(calcAveragePaise(tcs));

  const odd: Holding = { symbol: "ODD", qty: 3, investedPaise: 1000 };
  expect(applySell([odd], "ODD", 1)).toEqual([{ symbol: "ODD", qty: 2, investedPaise: 667 }]);
});

// Selling everything removes the holding; selling more than held changes nothing.
test("sell of the whole position removes it, and overselling is ignored", () => {
  expect(applySell([tcs], "TCS", 40)).toEqual([]);
  const holdings = [tcs];
  expect(applySell(holdings, "TCS", 41)).toBe(holdings);
});

// Further tests that could be added:
//
// 1. Other holdings are untouched by a trade
//    - Buying TCS returns the same INFY object, so INFY's row doesn't re-render.
//
// 2. Summary stays consistent after trades
//    - calcSummary after a buy equals the sum of the rows, same as before the trade.
