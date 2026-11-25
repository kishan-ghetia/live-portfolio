import { changeTone, formatChange, formatMoney, formatPct, toPaise } from "./money";

// Indian grouping: last 3 digits, then groups of 2 (lakh, crore), not groups of 3.
// Small amounts keep their leading zero and always show 2 decimals.
test("formats paise as rupees with Indian grouping", () => {
  expect(formatMoney(123456789)).toBe("₹12,34,567.89");
  expect(formatMoney(1000000000)).toBe("₹1,00,00,000.00");
  expect(formatMoney(99900)).toBe("₹999.00");
  expect(formatMoney(5)).toBe("₹0.05");
});

// P&L needs a visible direction:
// - losses always get "-", gains get "+" only when asked (P&L yes, prices no)
// - zero gets no sign
// - a missing price shows "--", never ₹0.00
test("adds signs for gains and losses, and -- for missing values", () => {
  expect(formatMoney(-20000)).toBe("-₹200.00");
  expect(formatMoney(20000, true)).toBe("+₹200.00");
  expect(formatMoney(0, true)).toBe("₹0.00");
  expect(formatMoney(null)).toBe("--");
});

// Percentages round to 2 decimals and always show direction.
// The sign comes from the real value, not the rounded one:
// a tiny loss shows "-0.00%" so it matches the red "-₹5.00" next to it.
test("formats percentages with sign and 2 decimals", () => {
  expect(formatPct(20)).toBe("+20.00%");
  expect(formatPct(-11.72256)).toBe("-11.72%");
  expect(formatPct(-0.001)).toBe("-0.00%");
  expect(formatPct(null)).toBe("--");
});

// Rupee floats like 1319.59 can't be stored exactly in binary,
// so toPaise rounds once at the boundary to get exact whole paise.
test("toPaise removes float noise", () => {
  expect(toPaise(1319.59)).toBe(131959);
  expect(toPaise(0.1 + 0.2)).toBe(30);
});

// P&L and day change show ₹ and % together; if either is missing the whole thing is "--".
// Colour comes from the raw value's sign (zero or missing = grey), never from the rounded text.
test("formats a change as ₹ and % and picks its colour from the raw sign", () => {
  expect(formatChange(20000, 20)).toBe("+₹200.00 · +20.00%");
  expect(formatChange(null, null)).toBe("--");
  expect(changeTone(-0.4)).toBe("loss");
  expect(changeTone(0)).toBe("muted");
  expect(changeTone(null)).toBe("muted");
});

// Further tests that could be added:
//
// 1. Fractional paise are rounded for display
//    - Average price (invested / qty) can be 1234.5 paise; it should show ₹12.35.
//
// 2. Tiny fractional loss keeps its sign
//    - formatMoney(-0.4) shows "-₹0.00", same rule as formatPct.
//
// 3. Negative amounts with grouping
//    - -123456789 shows "-₹12,34,567.89" with the sign before ₹.
