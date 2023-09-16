import { useCallback, useEffect, useRef, useState } from 'react';

type Listener<T> = (value: T) => void;
type Store<T> = {
  getState: () => T;
  setState: (newState: T) => void;
  subscribe: (listener: Listener<T>) => () => void;
};
type StoreMap = Map<string, Store<any>>;

const globalStores: StoreMap = new Map([]);

export function createStore<T>(initialState: T): Store<T> {
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

// Use a local store in a component
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
  ] as const;  // This ensures the returned tuple is readonly.
}

// Use a store in a component
export function useGlobalStore<T, K extends keyof T>(namespace: string, key: K): readonly [T[K], (newValue: T[K]) => void] {
  const store: Store<T> = getGlobalStore<T>(namespace) as Store<T>;
  return useStore(store, key);
}
