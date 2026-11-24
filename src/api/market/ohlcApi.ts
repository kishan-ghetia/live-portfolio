import { OHLC_URL } from "../../constants/urls";
import { http } from "../http";

export function fetchOhlc(symbols: readonly string[]): Promise<unknown> {
  return http.post(OHLC_URL, { symbols });
}
