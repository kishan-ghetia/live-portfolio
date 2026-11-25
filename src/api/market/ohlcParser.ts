import { z } from "zod";
import type { Quote } from "../../types/market";
import { toPaise } from "../../utils/money";
import { ApiError } from "../http";

const price = z.number().positive();
const optionalPrice = price.nullable().catch(null);

const OhlcRowSchema = z.object({
  symbol: z.string().min(1),
  ltp: price,
  prevClose: price,
  open: optionalPrice,
  high: optionalPrice,
  low: optionalPrice,
  volume: z.number().int().nonnegative().nullable().catch(null),
});

const OhlcResponseSchema = z.object({
  message: z.object({
    data: z.array(z.unknown()),
  }),
});

type OhlcRow = z.infer<typeof OhlcRowSchema>;

function toPaiseOrNull(rupees: number | null) {
  return rupees === null ? null : toPaise(rupees);
}

function toQuote(row: OhlcRow): Quote {
  return {
    symbol: row.symbol,
    ltp: toPaise(row.ltp),
    prevClose: toPaise(row.prevClose),
    open: toPaiseOrNull(row.open),
    high: toPaiseOrNull(row.high),
    low: toPaiseOrNull(row.low),
    volume: row.volume,
    seq: 0,
  };
}

export function parseOhlcResponse(json: unknown): Quote[] {
  const response = OhlcResponseSchema.safeParse(json);
  if (!response.success) {
    throw new ApiError("parse", "Unexpected OHLC response shape");
  }

  const quotes: Quote[] = [];
  for (const raw of response.data.message.data) {
    const row = OhlcRowSchema.safeParse(raw);
    if (row.success) quotes.push(toQuote(row.data));
  }
  return quotes;
}
