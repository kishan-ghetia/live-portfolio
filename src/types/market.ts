export type Paise = number;

export interface Quote {
  symbol: string;
  ltp: Paise;
  prevClose: Paise;
  open: Paise | null;
  high: Paise | null;
  low: Paise | null;
  volume: number | null;
}

export type QuoteMap = Record<string, Quote | undefined>;

export interface Tick {
  symbol: string;
  seq: number;
  ltp?: Paise;
  high?: Paise;
  low?: Paise;
  volume?: number;
}
