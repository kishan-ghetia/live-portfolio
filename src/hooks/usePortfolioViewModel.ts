import { useEffect, useState } from "react";
import { ApiError } from "../api/http";
import { fetchOhlc } from "../api/market/ohlcApi";
import { SYMBOLS } from "../constants/symbols";

export type PortfolioLoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: unknown };

export function usePortfolioViewModel(): PortfolioLoadState {
  const [state, setState] = useState<PortfolioLoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetchOhlc(SYMBOLS)
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((error: unknown) => {
        const message =
          error instanceof ApiError ? `${error.kind}: ${error.message}` : "Unknown error";
        if (!cancelled) setState({ status: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
