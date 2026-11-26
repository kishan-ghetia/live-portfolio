import { useRef, useState } from "react";
import { buyStock, sellStock, usePortfolioStore } from "../store/portfolioStore";
import { usePriceStore } from "../store/priceStore";
import { type TradeSide, validateQty } from "../utils/trade";

export function useTradeViewModel(symbol: string, initialSide: TradeSide) {
  const [side, setSide] = useState<TradeSide>(initialSide);
  const [qtyText, setQtyText] = useState("");
  const submitting = useRef(false);

  const price = usePriceStore((s) => s.quotes[symbol]?.ltp);
  const heldQty = usePortfolioStore(
    (s) => s.holdings.find((h) => h.symbol === symbol)?.qty ?? 0,
  );

  const check = validateQty(qtyText, side, heldQty);
  const estimatePaise = check.ok && price !== undefined ? check.qty * price : null;

  const changeQty = (text: string) => setQtyText(text.replace(/\D/g, ""));

  const confirm = (): boolean => {
    if (submitting.current || !check.ok) return false;
    const fillPrice = usePriceStore.getState().quotes[symbol]?.ltp;
    if (fillPrice === undefined) return false;

    submitting.current = true;
    if (side === "buy") buyStock(symbol, check.qty, fillPrice);
    else sellStock(symbol, check.qty);
    return true;
  };

  return {
    side,
    setSide,
    qtyText,
    changeQty,
    price,
    heldQty,
    error: check.ok ? null : check.error,
    estimatePaise,
    canConfirm: check.ok && price !== undefined,
    confirm,
  };
}
