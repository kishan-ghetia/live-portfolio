import type { Tick } from "../types/market";

export type TickHandler = (tick: Tick) => void;

export interface PriceSocket {
  connect(): void;
  disconnect(): void;
  onTick(handler: TickHandler): () => void;
}
