import type { Paise } from "./market";

export interface Holding {
  symbol: string;
  qty: number;
  investedPaise: Paise;
}
