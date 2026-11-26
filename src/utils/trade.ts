import type { Paise } from "../types/market";
import type { Holding } from "../types/portfolio";

export type TradeSide = "buy" | "sell";

export type QtyCheck = { ok: true; qty: number } | { ok: false; error: string | null };

export function validateQty(text: string, side: TradeSide, heldQty: number): QtyCheck {
  const trimmed = text.trim();
  if (trimmed === "") return { ok: false, error: null };
  if (!/^\d+$/.test(trimmed)) return { ok: false, error: "Enter a whole number" };

  const qty = Number(trimmed);
  if (!Number.isSafeInteger(qty)) return { ok: false, error: "That quantity is too large" };
  if (qty === 0) return { ok: false, error: "Enter a quantity above 0" };
  if (side === "sell" && qty > heldQty) {
    return { ok: false, error: `You hold ${heldQty}. You can't sell more.` };
  }

  return { ok: true, qty };
}

export function applyBuy(
  holdings: Holding[],
  symbol: string,
  qty: number,
  pricePaise: Paise,
): Holding[] {
  const cost = qty * pricePaise;
  const existing = holdings.find((h) => h.symbol === symbol);

  if (!existing) return [...holdings, { symbol, qty, investedPaise: cost }];

  return holdings.map((h) =>
    h.symbol === symbol ? { ...h, qty: h.qty + qty, investedPaise: h.investedPaise + cost } : h,
  );
}

export function applySell(holdings: Holding[], symbol: string, qty: number): Holding[] {
  const existing = holdings.find((h) => h.symbol === symbol);
  if (!existing || qty <= 0 || qty > existing.qty) return holdings;

  const remaining = existing.qty - qty;
  if (remaining === 0) return holdings.filter((h) => h.symbol !== symbol);

  const investedPaise = Math.round((existing.investedPaise * remaining) / existing.qty);
  return holdings.map((h) => (h.symbol === symbol ? { ...h, qty: remaining, investedPaise } : h));
}
