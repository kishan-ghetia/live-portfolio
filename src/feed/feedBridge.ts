import { usePriceStore } from "../store/priceStore";
import type { Tick } from "../types/market";
import { applyTicks } from "./applyTick";
import type { PriceSocket } from "./priceSocket";

const FLUSH_INTERVAL_MS = 100;

export function startFeedBridge(socket: PriceSocket): () => void {
  let pending: Tick[] = [];

  const unsubscribe = socket.onTick((tick) => {
    pending.push(tick);
  });

  const timer = setInterval(() => {
    if (pending.length === 0) return;
    const ticks = pending;
    pending = [];

    const { quotes, setState } = usePriceStore.getState();
    const next = applyTicks(quotes, ticks);
    if (next !== quotes) setState({ quotes: next });
  }, FLUSH_INTERVAL_MS);

  return () => {
    unsubscribe();
    clearInterval(timer);
  };
}
