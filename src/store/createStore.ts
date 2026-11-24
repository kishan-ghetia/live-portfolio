import { create } from "zustand";

export interface StoreActions<T> {
  setState: (update: Partial<T> | ((state: T) => Partial<T>)) => void;
  resetState: () => void;
}

type Store<T> = T & StoreActions<T>;

type StoreUpdate<T> = Partial<Store<T>> | ((state: Store<T>) => Partial<Store<T>>);

export function createStore<T extends object>(initialState: T) {
  return create<Store<T>>()((set) => ({
    ...initialState,
    setState: (update) => set(update as StoreUpdate<T>),
    resetState: () => set(initialState as Partial<Store<T>>),
  }));
}
