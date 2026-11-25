import type { Tick } from "../types/market";
import type { PriceSocket, TickHandler } from "../feed/priceSocket";

export function createFakeSocket() {
  let handler: TickHandler | null = null;
  const socket: PriceSocket = {
    connect() {},
    disconnect() {},
    onTick(h) {
      handler = h;
      return () => {
        handler = null;
      };
    },
  };
  return { socket, send: (tick: Tick) => handler?.(tick) };
}
