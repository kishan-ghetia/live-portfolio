import type { Paise } from "../types/market";

export function toPaise(rupees: number): Paise {
  return Math.round(rupees * 100);
}

function groupIndian(digits: string): string {
  if (digits.length <= 3) return digits;

  const lastThree = digits.slice(-3);
  let rest = digits.slice(0, -3);
  const pairs: string[] = [];
  while (rest.length > 2) {
    pairs.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  return [rest, ...pairs, lastThree].join(",");
}

export function formatMoney(paise: Paise | null, showPlus = false): string {
  if (paise === null) return "--";

  const abs = Math.round(Math.abs(paise));
  const rupees = groupIndian(String(Math.floor(abs / 100)));
  const decimals = String(abs % 100).padStart(2, "0");
  const sign = paise < 0 ? "-" : showPlus && paise > 0 ? "+" : "";

  return `${sign}₹${rupees}.${decimals}`;
}

export function formatVolume(volume: number | null): string {
  if (volume === null) return "--";
  return groupIndian(String(Math.round(volume)));
}

export function formatPct(pct: number | null): string {
  if (pct === null) return "--";

  const sign = pct < 0 ? "-" : pct > 0 ? "+" : "";
  return `${sign}${Math.abs(pct).toFixed(2)}%`;
}

export function formatChange(paise: Paise | null, pct: number | null): string {
  if (paise === null || pct === null) return "--";
  return `${formatMoney(paise, true)} · ${formatPct(pct)}`;
}

export function changeTone(value: number | null) {
  if (value === null || value === 0) return "muted";
  return value > 0 ? "gain" : "loss";
}
