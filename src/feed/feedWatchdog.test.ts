import { usePriceStore } from "../store/priceStore";
import { createFakeSocket } from "../test/fakeSocket";
import { startFeedWatchdog } from "./feedWatchdog";

const tick = { symbol: "TCS", seq: 1, ltp: 246000 };
const feedStatus = () => usePriceStore.getState().feedStatus;

beforeEach(() => {
  jest.useFakeTimers();
  usePriceStore.getState().resetState();
});
afterEach(() => jest.useRealTimers());

// Ticks keep arriving well inside 2s, so the feed stays live the whole time.
test("stays live while ticks keep arriving", () => {
  const { socket, send } = createFakeSocket();
  startFeedWatchdog(socket);

  for (let i = 0; i < 5; i++) {
    jest.advanceTimersByTime(1000);
    send(tick);
  }

  expect(feedStatus()).toBe("live");
});

// 2s with no tick means the feed has gone quiet: show "prices paused".
// The next tick means it is back: hide the indicator.
test("pauses after 2s of silence and goes live on the next tick", () => {
  const { socket, send } = createFakeSocket();
  startFeedWatchdog(socket);

  jest.advanceTimersByTime(2000);
  expect(feedStatus()).toBe("paused");

  send(tick);
  expect(feedStatus()).toBe("live");
});

// Further tests that could be added:
//
// 1. Stop clears the countdown
//    - After stop, 2s of silence does not flip the status to paused.
//
// 2. Works with the real simulator
//    - Its 5s silence after 60s flips to paused, then back to live when ticks resume.
