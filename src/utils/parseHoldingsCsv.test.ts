import { HOLDINGS_CSV } from "../data/holdings";
import { parseHoldingsCsv } from "./parseHoldingsCsv";

// Total cost is qty × avg price in whole paise, so later P&L math stays exact.
// 25 × ₹1319.59 = ₹32,989.75 = 3298975 paise.
test("a row becomes a holding with its total cost in paise", () => {
  const [holding] = parseHoldingsCsv("symbol,qty,avgPrice\nRELIANCE,25,1319.59");

  expect(holding).toEqual({ symbol: "RELIANCE", qty: 25, investedPaise: 3298975 });
});

// The bundled file keeps every row, including OLDCO, which the price API never returns.
// Its missing price is handled later as "--", not by dropping the holding here.
test("bundled holdings include all 21 rows and OLDCO", () => {
  const holdings = parseHoldingsCsv(HOLDINGS_CSV);

  expect(holdings).toHaveLength(21);
  expect(holdings.find((h) => h.symbol === "OLDCO")).toEqual({
    symbol: "OLDCO",
    qty: 30,
    investedPaise: 1237500,
  });
});

// Malformed lines (fractional qty, zero qty, missing or non-numeric price) are skipped,
// and valid lines around them still load.
test("bad lines are skipped and good lines are kept", () => {
  const csv = [
    "symbol,qty,avgPrice",
    "HALF,1.5,100",
    "ZERO,0,100",
    "NOPRICE,10,",
    "TEXT,10,abc",
    "TCS,40,2589.71",
  ].join("\n");

  expect(parseHoldingsCsv(csv).map((h) => h.symbol)).toEqual(["TCS"]);
});

// Further tests that could be added:
//
// 1. Windows line endings
//    - A CSV saved with \r\n should parse the same as \n.
//
// 2. Extra spaces around values
//    - " TCS , 40 , 2589.71 " should still parse correctly.
