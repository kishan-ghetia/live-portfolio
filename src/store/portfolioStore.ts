import { HOLDINGS_CSV } from "../data/holdings";
import type { Holding } from "../types/portfolio";
import { parseHoldingsCsv } from "../utils/parseHoldingsCsv";
import { createZustandStore } from "./createZustandStore";

interface PortfolioState {
  holdings: Holding[];
}

export const usePortfolioStore = createZustandStore<PortfolioState>({
  holdings: parseHoldingsCsv(HOLDINGS_CSV),
});
