import { HOLDINGS_CSV } from "../data/holdings";
import type { Paise } from "../types/market";
import type { Holding } from "../types/portfolio";
import { parseHoldingsCsv } from "../utils/parseHoldingsCsv";
import { applyBuy, applySell } from "../utils/trade";
import { createZustandStore } from "./createZustandStore";

interface PortfolioState {
  holdings: Holding[];
}

export const usePortfolioStore = createZustandStore<PortfolioState>({
  holdings: parseHoldingsCsv(HOLDINGS_CSV),
});

export function buyStock(symbol: string, qty: number, pricePaise: Paise): void {
  const { holdings, setState } = usePortfolioStore.getState();
  setState({ holdings: applyBuy(holdings, symbol, qty, pricePaise) });
}

export function sellStock(symbol: string, qty: number): void {
  const { holdings, setState } = usePortfolioStore.getState();
  setState({ holdings: applySell(holdings, symbol, qty) });
}
