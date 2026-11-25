import { usePriceStore } from "../store/priceStore";
import type { PriceSocket } from "./priceSocket";

const SILENCE_LIMIT_MS = 2000;

export function startFeedWatchdog(socket: PriceSocket): () => void {
  const { setState } = usePriceStore.getState();
  let timer: ReturnType<typeof setTimeout> | null = null;

  function restartCountdown() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => setState({ feedStatus: "paused" }), SILENCE_LIMIT_MS);
  }

  const unsubscribe = socket.onTick(() => {
    if (usePriceStore.getState().feedStatus !== "live") setState({ feedStatus: "live" });
    restartCountdown();
  });
  restartCountdown();

  return () => {
    unsubscribe();
    if (timer) clearTimeout(timer);
  };
}
