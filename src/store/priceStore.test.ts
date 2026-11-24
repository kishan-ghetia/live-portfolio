import { ApiError } from "../api/http";
import { fetchOhlc } from "../api/market/ohlcApi";
import type { Quote } from "../types/market";
import { loadQuotes, usePriceStore } from "./priceStore";

jest.mock("../api/market/ohlcApi");
const mockFetchOhlc = jest.mocked(fetchOhlc);

const tcs: Quote = {
  symbol: "TCS",
  ltp: 246000,
  prevClose: 237620,
  open: null,
  high: null,
  low: null,
  volume: null,
};

beforeEach(() => {
  usePriceStore.getState().resetState();
});

// A successful load stores the quotes keyed by symbol and marks the store ready.
test("successful load stores quotes by symbol", async () => {
  mockFetchOhlc.mockResolvedValue([tcs]);

  await loadQuotes(["TCS"]);

  const state = usePriceStore.getState();
  expect(state.status).toBe("ready");
  expect(state.quotes.TCS).toEqual(tcs);
});

// A failed load moves to the error state with a readable message for the screen.
test("failed load sets an error message", async () => {
  mockFetchOhlc.mockRejectedValue(new ApiError("network", "Network request failed"));

  await loadQuotes(["TCS"]);

  const state = usePriceStore.getState();
  expect(state.status).toBe("error");
  expect(state.error).toBe("No internet connection");
});
