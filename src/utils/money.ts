import type { Paise } from "../types/market";

export function toPaise(rupees: number): Paise {
  return Math.round(rupees * 100);
}
