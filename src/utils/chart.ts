import type { Paise } from "../types/market";

const EDGE = 4;

export interface ChartPoint {
  x: number;
  y: number;
}

export interface ChartShape {
  points: ChartPoint[];
  openY: number;
}

export function toChartShape(
  prices: Paise[],
  openPrice: Paise,
  width: number,
  height: number,
): ChartShape | null {
  if (prices.length < 2 || width <= 0 || height <= 0) return null;

  let min = openPrice;
  let max = openPrice;
  for (const price of prices) {
    if (price < min) min = price;
    if (price > max) max = price;
  }

  const range = max - min;
  const usable = height - EDGE * 2;
  const step = (width - EDGE * 2) / (prices.length - 1);
  const toY = (price: Paise) =>
    range === 0 ? height / 2 : EDGE + usable - ((price - min) / range) * usable;

  const points: ChartPoint[] = [];
  for (let i = 0; i < prices.length; i++) {
    points.push({ x: EDGE + i * step, y: toY(prices[i]) });
  }

  return { points, openY: toY(openPrice) };
}

export function calcChangeSince(
  from: Paise | null,
  to: Paise | undefined,
): { changePaise: Paise; changePct: number } | null {
  if (from === null || to === undefined) return null;
  const changePaise = to - from;
  return { changePaise, changePct: from === 0 ? 0 : (changePaise / from) * 100 };
}
