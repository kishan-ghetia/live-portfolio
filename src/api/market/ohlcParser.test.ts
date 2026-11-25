import { ApiError } from "../http";
import { parseOhlcResponse } from "./ohlcParser";

const row = {
  symbol: "RELIANCE",
  ltp: 1164.9,
  open: 1170.4,
  prevClose: 1167.4,
  high: 1174.6,
  low: 1152.5,
  volume: 14753650,
};

const wrap = (data: unknown[]) => ({ status: "success", message: { data } });

// A normal API row is converted into our Quote shape:
// - every price becomes whole paise (1164.9 rupees -> 116490)
// - extra API fields are left out
test("valid row becomes a Quote in paise", () => {
  expect(parseOhlcResponse(wrap([row]))).toEqual([
    {
      symbol: "RELIANCE",
      ltp: 116490,
      prevClose: 116740,
      open: 117040,
      high: 117460,
      low: 115250,
      volume: 14753650,
    },
  ]);
});

// A stock with a missing, zero or null ltp/prevClose can't be valued, so it is skipped.
// The other stocks in the same response must still load (one bad row never hides the rest).
test("a row without a usable price is dropped, other rows are kept", () => {
  const quotes = parseOhlcResponse(
    wrap([
      { ...row, symbol: "NOLTP", ltp: undefined },
      { ...row, symbol: "ZERO", ltp: 0 },
      { ...row, symbol: "NULLPREV", prevClose: null },
      { ...row, symbol: "TCS" },
    ]),
  );

  expect(quotes.map((q) => q.symbol)).toEqual(["TCS"]);
});

// open/high/low/volume are only shown, never used in P&L.
// A bad value there becomes null (shown as "--") while the stock itself is kept.
test("a bad display-only field becomes null without dropping the row", () => {
  const [quote] = parseOhlcResponse(
    wrap([{ ...row, high: null, volume: "lots" }]),
  );

  expect(quote.high).toBeNull();
  expect(quote.volume).toBeNull();
  expect(quote.ltp).toBe(116490);
});

// If the response isn't { message: { data: [...] } } at all, nothing can be trusted,
// so the whole call fails with a parse error and the screen shows the error state.
test("unexpected response shape throws a parse error", () => {
  expect(() => parseOhlcResponse({ message: {} })).toThrow(ApiError);
});

// Further tests that could be added:
//
// 1. Extra unknown fields are ignored
//    - The API sends fields we don't use (isin, scripId, tsn).
//    - The test would confirm they don't break parsing or end up in Quote.
//
// 2. Prices with float noise convert to exact paise
//    - e.g. 0.1 + 0.2 should become 30 paise, not 30.000000000000004.
//    - Belongs with the money utils tests once those exist.
