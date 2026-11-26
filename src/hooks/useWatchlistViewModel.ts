import { useMemo, useState } from "react";
import { SYMBOLS } from "../constants/symbols";
import { loadQuotes, usePriceStore } from "../store/priceStore";
import { useWatchlistStore } from "../store/watchlistStore";

export type WatchlistLoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; symbols: string[] };

export function useWatchlistViewModel() {
  const symbols = useWatchlistStore((s) => s.symbols);
  const status = usePriceStore((s) => s.status);
  const error = usePriceStore((s) => s.error);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const search = query.trim().toUpperCase();
  const results = useMemo(
    () => SYMBOLS.filter((symbol) => symbol.includes(search)),
    [search],
  );

  let state: WatchlistLoadState;
  if (status === "error") state = { status, message: error ?? "Something went wrong" };
  else if (status === "ready") state = { status, symbols };
  else state = { status };

  const retry = () => loadQuotes(SYMBOLS);

  return {
    state,
    retry,
    query,
    setQuery,
    setSearchFocused,
    showResults: searchFocused || search.length > 0,
    results,
  };
}
