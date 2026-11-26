import AsyncStorage from "@react-native-async-storage/async-storage";
import { addToWatchlist, removeFromWatchlist, useWatchlistStore } from "./watchlistStore";

beforeEach(() => {
  useWatchlistStore.getState().resetState();
});

// Symbols are kept in the order the user added them.
test("add appends symbols in the order they were added", () => {
  addToWatchlist("TCS");
  addToWatchlist("INFY");

  expect(useWatchlistStore.getState().symbols).toEqual(["TCS", "INFY"]);
});

// A symbol already in the list, or one not in the allowed 25, is not added.
test("duplicate and unknown symbols are ignored", () => {
  addToWatchlist("TCS");
  addToWatchlist("TCS");
  addToWatchlist("NOTREAL");

  expect(useWatchlistStore.getState().symbols).toEqual(["TCS"]);
});

// Removing takes the symbol out; removing one that isn't there changes nothing.
test("remove takes a symbol out and ignores missing ones", () => {
  addToWatchlist("TCS");
  addToWatchlist("INFY");

  removeFromWatchlist("TCS");
  removeFromWatchlist("SBIN");

  expect(useWatchlistStore.getState().symbols).toEqual(["INFY"]);
});

// Every change is saved to storage under the "watchlist" key, without the store functions.
test("the watchlist is written to storage", async () => {
  addToWatchlist("RELIANCE");

  const saved = await AsyncStorage.getItem("watchlist");

  expect(JSON.parse(saved ?? "null")).toEqual({
    state: { symbols: ["RELIANCE"] },
    version: 0,
  });
});

// Further tests that could be added:
//
// 1. Rehydration on app restart
//    - Put a saved watchlist in storage, load the store module fresh (jest.isolateModules), check symbols are restored.
//
// 2. Corrupt saved data
//    - Invalid JSON under "watchlist" leaves the store with an empty list instead of crashing.
//
// 3. Non-persisted stores never touch storage
//    - A store created without persistKey makes no AsyncStorage.setItem calls.
