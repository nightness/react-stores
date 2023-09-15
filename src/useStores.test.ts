import { act, renderHook } from '@testing-library/react-hooks/dom';
import { createStore, useCreateStore, useStore, useCreateGlobalStore, useGlobalStore } from './useStores'; // Adjust the import path

interface TestState {
    count: number;
}

describe('createStore', () => {
    it('should initialize with the correct state', () => {
        const store = createStore({ count: 0 });
        expect(store.getState()).toEqual({ count: 0 });
    });

    it('should update state correctly', () => {
        const store = createStore({ count: 0 });
        store.setState({ count: 1 });
        expect(store.getState()).toEqual({ count: 1 });
    });

    it('should notify subscribers when state changes', () => {
        const store = createStore({ count: 0 });
        const listener = jest.fn();
        store.subscribe(listener);
        store.setState({ count: 1 });
        expect(listener).toHaveBeenCalledWith({ count: 1 });
    });
});

describe('useCreateStore', () => {
    it('should create a store with initial state', () => {
        const { result } = renderHook(() => useCreateStore({ count: 0 }));
        expect(result.current.getState()).toEqual({ count: 0 });
    });
});

describe('useStore', () => {
    it('should return current state and a setter function', () => {
        const store = createStore({ count: 0 });
        const { result } = renderHook(() => useStore(store, 'count'));
        const [state, setState] = result.current;
        expect(state).toBe(0);
        act(() => setState(1));
        expect(store.getState().count).toBe(1);
    });
});

describe('Global Store', () => {
    it('should create and retrieve a global store', () => {
        const { result } = renderHook(() => useCreateGlobalStore<TestState>('testNamespace', { count: 0 }));
        expect(result.current.getState()).toEqual({ count: 0 });

        const { result: globalStoreResult } = renderHook(() => useGlobalStore<TestState, keyof TestState>('testNamespace', 'count'));
        const [globalState, setGlobalState] = globalStoreResult.current;
        expect(globalState).toBe(0);
        act(() => setGlobalState(2));
        expect(result.current.getState().count).toBe(2);
    });
});
