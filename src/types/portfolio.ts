import type { Paise } from "./market";

export interface Holding {
  symbol: string;
  qty: number;
  investedPaise: Paise;
}

export interface HoldingValues {
  valuePaise: Paise;
  pnlPaise: Paise;
  pnlPct: number;
  dayChangePaise: Paise;
}

export interface PortfolioSummary {
  investedPaise: Paise;
  valuePaise: Paise;
  pnlPaise: Paise;
  pnlPct: number;
  dayChangePaise: Paise;
  dayChangePct: number;
  unpricedSymbols: string[];
}
