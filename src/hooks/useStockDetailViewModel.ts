import { usePortfolioStore } from "../store/portfolioStore";
import { usePriceStore } from "../store/priceStore";
import { calcDayChange, calcHolding } from "../utils/pnl";

export function useStockDetailViewModel(symbol: string) {
  const quote = usePriceStore((s) => s.quotes[symbol]);
  const holding = usePortfolioStore((s) => s.holdings.find((h) => h.symbol === symbol));
  const dayChange = calcDayChange(quote);
  const position = holding ? calcHolding(holding, quote) : null;

  return {
    quote,
    dayChange,
    holding,
    position,
    canBuy: quote !== undefined,
    canSell: quote !== undefined && holding !== undefined,
  };
}
