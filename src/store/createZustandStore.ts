import { create, type StateCreator, type StoreApi, type UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";
import { storage } from "./storage";

export interface StoreActions<T> {
  setState: (update: Partial<T> | ((state: T) => Partial<T>)) => void;
  resetState: () => void;
}

type Store<T> = T & StoreActions<T>;

type StoreUpdate<T> = Partial<Store<T>> | ((state: Store<T>) => Partial<Store<T>>);

interface StoreOptions {
  persistKey?: string;
}

export function createZustandStore<T extends object>(
  initialState: T,
  options?: StoreOptions,
): UseBoundStore<StoreApi<Store<T>>> {
  const creator: StateCreator<Store<T>> = (set) => ({
    ...initialState,
    setState: (update) => set(update as StoreUpdate<T>),
    resetState: () => set(initialState as Partial<Store<T>>),
  });

  if (!options?.persistKey) return create<Store<T>>()(creator);

  return create<Store<T>>()(
    persist(creator, {
      name: options.persistKey,
      storage,
      partialize: ({ setState, resetState, ...state }) => state,
    }),
  );
}
