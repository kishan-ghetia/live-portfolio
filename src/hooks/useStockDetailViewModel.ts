import { usePortfolioStore } from "../store/portfolioStore";
import { usePriceStore } from "../store/priceStore";

export function useStockDetailViewModel(symbol: string) {
  const hasPrice = usePriceStore((s) => s.quotes[symbol] !== undefined);
  const holding = usePortfolioStore((s) => s.holdings.find((h) => h.symbol === symbol));

  return {
    holding,
    canBuy: hasPrice,
    canSell: hasPrice && holding !== undefined,
  };
}
