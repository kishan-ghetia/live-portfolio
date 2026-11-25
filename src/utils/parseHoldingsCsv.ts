import type { Holding } from "../types/portfolio";
import { toPaise } from "./money";

export function parseHoldingsCsv(csv: string): Holding[] {
  const holdings: Holding[] = [];
  const lines = csv.trim().split(/\r?\n/).slice(1);

  for (const line of lines) {
    const [symbol, qtyText, avgText] = line.split(",").map((part) => part.trim());
    const qty = Number(qtyText);
    const avgPrice = Number(avgText);

    if (!symbol || !Number.isInteger(qty) || qty <= 0) continue;
    if (!Number.isFinite(avgPrice) || avgPrice <= 0) continue;

    holdings.push({ symbol, qty, investedPaise: qty * toPaise(avgPrice) });
  }

  return holdings;
}
