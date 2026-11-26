import { calcChangeSince, toChartShape } from "./chart";

// The lowest price sits at the bottom and the highest at the top (SVG y grows downwards),
// with a 4px edge on every side so the line and end dot aren't clipped.
test("maps prices from left to right, low at the bottom, high at the top", () => {
  expect(toChartShape([100, 200], 100, 100, 50)?.points).toEqual([
    { x: 4, y: 46 },
    { x: 96, y: 4 },
  ]);
});

// Only the last 60 ticks are drawn, but the opening price may be older than that.
// It is included in the scale so the dashed opening line always stays inside the chart.
test("keeps the opening price inside the scale even when it left the window", () => {
  const shape = toChartShape([200, 300], 100, 100, 50);
  expect(shape?.openY).toBe(46);
  expect(shape?.points.map((p) => p.y)).toEqual([25, 4]);
});

// No movement yet means no range to scale by: draw a flat line through the middle.
test("draws a flat line in the middle when the price hasn't moved", () => {
  expect(toChartShape([150, 150], 150, 100, 50)?.points.map((p) => p.y)).toEqual([25, 25]);
});

// A line needs two points, and nothing can be drawn before the chart has a size.
test("returns nothing with fewer than 2 prices or no size yet", () => {
  expect(toChartShape([150], 150, 100, 50)).toBeNull();
  expect(toChartShape([100, 200], 100, 0, 50)).toBeNull();
});

// The label compares the latest price with the price when the screen opened,
// not with the oldest tick still in the 60-tick window.
test("change since the opening price", () => {
  expect(calcChangeSince(10000, 10250)).toEqual({ changePaise: 250, changePct: 2.5 });
  expect(calcChangeSince(null, 10250)).toBeNull();
});

// Further tests that could be added:
//
// 1. Many points stay inside the width
//    - 60 prices: first x is the 4px edge, last x is width minus 4px.
//
// 2. Tiny moves still use the full height
//    - Prices 100000 and 100001 paise still span top to bottom (scaled to the range, not to zero).
