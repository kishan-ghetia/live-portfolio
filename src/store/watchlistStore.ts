import { SYMBOLS } from "../constants/symbols";
import { createZustandStore } from "./createZustandStore";

interface WatchlistState {
  symbols: string[];
}

export const useWatchlistStore = createZustandStore<WatchlistState>(
  { symbols: [] },
  { persistKey: "watchlist" },
);

export function addToWatchlist(symbol: string): void {
  const { symbols, setState } = useWatchlistStore.getState();
  if (!SYMBOLS.includes(symbol) || symbols.includes(symbol)) return;
  setState({ symbols: [...symbols, symbol] });
}

export function removeFromWatchlist(symbol: string): void {
  const { symbols, setState } = useWatchlistStore.getState();
  if (!symbols.includes(symbol)) return;
  setState({ symbols: symbols.filter((s) => s !== symbol) });
}
