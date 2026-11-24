import { createStore } from "./createStore";

const makeCounterStore = () =>
  createStore({ count: 0, label: "start" });

test("setState merges a partial update and keeps other fields", () => {
  const store = makeCounterStore();

  store.getState().setState({ count: 5 });

  expect(store.getState().count).toBe(5);
  expect(store.getState().label).toBe("start");
});

test("setState accepts an updater based on the current state", () => {
  const store = makeCounterStore();

  store.getState().setState({ count: 2 });
  store.getState().setState((state) => ({ count: state.count + 1 }));

  expect(store.getState().count).toBe(3);
});

test("resetState restores the initial values", () => {
  const store = makeCounterStore();

  store.getState().setState({ count: 9, label: "changed" });
  store.getState().resetState();

  expect(store.getState().count).toBe(0);
  expect(store.getState().label).toBe("start");
});
