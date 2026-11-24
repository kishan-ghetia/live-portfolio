import { ApiError } from "../api/http";
import { fetchOhlc } from "../api/market/ohlcApi";
import type { Quote, QuoteMap } from "../types/market";
import { createZustandStore } from "./createZustandStore";

export type LoadStatus = "loading" | "ready" | "error";

interface PriceState {
  quotes: QuoteMap;
  status: LoadStatus;
  error: string | null;
}

export const usePriceStore = createZustandStore<PriceState>({
  quotes: {},
  status: "loading",
  error: null,
});

function toQuoteMap(quotes: Quote[]): QuoteMap {
  const map: QuoteMap = {};
  for (const quote of quotes) map[quote.symbol] = quote;
  return map;
}

function errorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return "Something went wrong";
  switch (error.kind) {
    case "network":
      return "No internet connection";
    case "timeout":
      return "The price server took too long to respond";
    case "http":
      return `The price server returned an error (${error.status})`;
    case "parse":
      return "Received unexpected data from the price server";
  }
}

export async function loadQuotes(symbols: readonly string[]): Promise<void> {
  const { setState } = usePriceStore.getState();
  setState({ status: "loading", error: null });
  try {
    const quotes = await fetchOhlc(symbols);
    setState({ quotes: toQuoteMap(quotes), status: "ready" });
  } catch (error) {
    setState({ status: "error", error: errorMessage(error) });
  }
}
