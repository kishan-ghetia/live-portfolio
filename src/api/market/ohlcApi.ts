import { OHLC_URL } from "../../constants/urls";
import type { Quote } from "../../types/market";
import { http } from "../http";
import { parseOhlcResponse } from "./ohlcParser";

export async function fetchOhlc(symbols: readonly string[]): Promise<Quote[]> {
  const json = await http.post(OHLC_URL, { symbols });
  return parseOhlcResponse(json);
}
