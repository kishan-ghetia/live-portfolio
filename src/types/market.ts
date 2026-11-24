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
