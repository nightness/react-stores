import { useCallback, useEffect, useRef, useState } from 'react';

type Listener<T> = (value: T) => void;
type Store<T> = {
  getState: () => T;
  setState: (newState: T) => void;
  subscribe: (listener: Listener<T>) => () => void;
};
type StoreMap = Map<string, Store<any>>;

const globalStores: StoreMap = new Map([]);

function createStore<T>(initialState: T): Store<T> {
  let state = initialState;
  const listeners = new Set<Listener<T>>([]);

  const getState = () => state;

  const setState = (newState: T) => {
    state = newState;
    listeners.forEach((listener) => listener(state));
  };

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    getState,
    setState,
    subscribe,
  };
}

function getGlobalStore<T>(namespace: string): Store<T> | null {
  if (globalStores.has(namespace)) {
    return globalStores.get(namespace) as Store<T>;
  } else {
    return null;
  }
}

function setGlobalStore<T>(namespace: string, store: Store<T>) {
  globalStores.set(namespace, store);
}

// Hook to create a global store
export function useCreateGlobalStore<T>(
  namespace: string,
  initialState: T
): Store<T> {
  const store = getGlobalStore<T>(namespace) ?? createStore<T>(initialState);
  setGlobalStore<T>(namespace, store);
  return useRef(store).current;
}

// Hook to create a local store
export function useCreateStore<T>(initialState: T): Store<T> {
  return useRef(createStore(initialState)).current;
}

// useState for the store
export function useStore<T, K extends keyof T>(store: Store<T>, key: K): readonly [T[K], (newValue: T[K]) => void] {
  const selector = useCallback((state: T) => state[key], [key]);
  const [localState, setLocalState] = useState<T[K]>(
    selector(store.getState())
  );

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

// Use an existing (parents) global store
export function useGlobalStore<T>(
  namespace: string
): Store<T> {
  return getGlobalStore<T>(namespace) as Store<T>;
}
