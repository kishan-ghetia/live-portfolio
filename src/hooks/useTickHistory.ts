import { useEffect, useState } from "react";
import { usePriceStore } from "../store/priceStore";
import type { Paise } from "../types/market";

const MAX_POINTS = 60;

export function useTickHistory(symbol: string): { openPrice: Paise | null; prices: Paise[] } {
  const [openPrice, setOpenPrice] = useState<Paise | null>(
    () => usePriceStore.getState().quotes[symbol]?.ltp ?? null,
  );
  const [prices, setPrices] = useState<Paise[]>(() => {
    const quote = usePriceStore.getState().quotes[symbol];
    return quote ? [quote.ltp] : [];
  });

  useEffect(() => {
    return usePriceStore.subscribe((state, prevState) => {
      const quote = state.quotes[symbol];
      const prevQuote = prevState.quotes[symbol];
      if (!quote || quote.ltp === prevQuote?.ltp) return;
      const ltp = quote.ltp;
      setOpenPrice((current) => current ?? ltp);
      setPrices((current) => [...current.slice(-(MAX_POINTS - 1)), ltp]);
    });
  }, [symbol]);

  return { openPrice, prices };
}
