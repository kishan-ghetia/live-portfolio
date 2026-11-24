import { usePriceStore } from "../store/priceStore";
import type { QuoteMap } from "../types/market";

export type PortfolioLoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: QuoteMap };

export function usePortfolioViewModel(): PortfolioLoadState {
  const status = usePriceStore((s) => s.status);
  const error = usePriceStore((s) => s.error);
  const quotes = usePriceStore((s) => s.quotes);

  if (status === "error") return { status, message: error ?? "Something went wrong" };
  if (status === "ready") return { status, data: quotes };
  return { status };
}
