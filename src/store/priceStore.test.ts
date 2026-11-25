import { ApiError } from "../api/http";
import { fetchOhlc } from "../api/market/ohlcApi";
import type { Quote } from "../types/market";
import { loadQuotes, refreshQuotes, usePriceStore } from "./priceStore";

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

// Pull-to-refresh that fails must not wipe a screen that was already working:
// - old prices stay, status stays "ready" (no full error screen)
// - refreshError is set so the screen can show a small banner instead
test("failed refresh keeps old prices and sets a refresh error", async () => {
  usePriceStore.getState().setState({ quotes: { TCS: tcs }, status: "ready" });
  mockFetchOhlc.mockRejectedValue(new ApiError("timeout", "Request timed out"));

  await refreshQuotes(["TCS"]);

  const state = usePriceStore.getState();
  expect(state.quotes.TCS).toEqual(tcs);
  expect(state.status).toBe("ready");
  expect(state.refreshing).toBe(false);
  expect(state.refreshError).toBe("The price server took too long to respond");
});

// A successful refresh replaces the prices and clears any earlier refresh error.
test("successful refresh replaces prices and clears the refresh error", async () => {
  const newTcs = { ...tcs, ltp: 250000 };
  usePriceStore.getState().setState({ quotes: { TCS: tcs }, status: "ready", refreshError: "old" });
  mockFetchOhlc.mockResolvedValue([newTcs]);

  await refreshQuotes(["TCS"]);

  const state = usePriceStore.getState();
  expect(state.quotes.TCS).toEqual(newTcs);
  expect(state.refreshing).toBe(false);
  expect(state.refreshError).toBeNull();
});

// Further tests that could be added:
//
// 1. A second refresh while one is running is ignored
//    - Pulling twice quickly should call fetchOhlc only once.
//
// 2. refreshing is true while the request is in flight
//    - Drives the pull-to-refresh spinner.
