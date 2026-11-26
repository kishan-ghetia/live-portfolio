import { usePriceStore } from "../store/priceStore";
import { calcDayChange } from "../utils/pnl";

export function useStockDetailViewModel(symbol: string) {
  const quote = usePriceStore((s) => s.quotes[symbol]);
  const dayChange = calcDayChange(quote);

  return { quote, dayChange };
}
