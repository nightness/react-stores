import { useCallback, useEffect, useRef, useState } from 'react';

type Listener<T> = (value: T) => void;

type StoreMap = Map<string, Store<any>>;

class Store<T> {
  private state: T;
  private listeners = new Set<Listener<T>>();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(newState: T) {
    this.state = newState;
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

class GlobalStoreManager {
  private static globalStores: StoreMap = new Map();

  static getStore<T>(namespace: string): Store<T> | null {
    return this.globalStores.has(namespace)
      ? (this.globalStores.get(namespace) as Store<T>)
      : null;
  }

  static setStore<T>(namespace: string, store: Store<T>) {
    this.globalStores.set(namespace, store);
  }
}

export function useGlobalStore<T>(namespace: string, initialState?: T): Store<T> {
  let store = GlobalStoreManager.getStore<T>(namespace);
  if (!store) {
    if (!initialState) {
      throw new Error('initialState is required when creating a new store');
    }
    store = new Store<T>(initialState);
  }
  GlobalStoreManager.setStore<T>(namespace, store);
  return useRef(store).current;
}

export function useCreateStore<T>(initialState: T): Store<T> {
  return useRef(new Store(initialState)).current;
}

export function useStore<T, K extends keyof T>(store: Store<T>, key: K): readonly [T[K], (newValue: T[K]) => void] {
  const selector = useCallback((state: T) => state[key], [key]);
  const [localState, setLocalState] = useState<T[K]>(selector(store.getState()));

  useEffect(() => {
    const listener = (newState: T) => {
      setLocalState(selector(newState));
    };

    return store.subscribe(listener);
  }, [store, selector]);

  return [
    localState,
    (newValue: T[K]) => {
      store.setState({
        ...store.getState(),
        [key]: newValue,
      });
    },
  ] as const;
}
