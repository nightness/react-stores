import { act, renderHook } from '@testing-library/react-hooks/dom';
import { useCreateStore, useStore, useGlobalStore } from './stores'; // Adjust the import path

interface TestState {
    count: number;
}

describe('useCreateStore', () => {
    it('should create a store with initial state', () => {
        const { result } = renderHook(() => useCreateStore({ count: 0 }));
        expect(result.current.getState()).toEqual({ count: 0 });
    });
});

describe('useStore', () => {
    it('should return current state and a setter function', () => {
        const store = useCreateStore({ count: 0 });
        const { result } = renderHook(() => useStore(store, 'count'));
        const [state, setState] = result.current;
        expect(state).toBe(0);
        act(() => setState(1));
        expect(store.getState().count).toBe(1);
    });
});

describe('useGlobalStore', () => {
    it('should create and retrieve a global store', () => {
        const { result } = renderHook(() => useGlobalStore<TestState>('testNamespace', { count: 0 }));
        expect(result.current.getState()).toEqual({ count: 0 });

        const store = useGlobalStore<TestState>('testNamespace');
        const { result: globalStoreResult } = renderHook(() => useStore(store, 'count'));
        const [globalState, setGlobalState] = globalStoreResult.current;
        expect(globalState).toBe(0);
        act(() => setGlobalState(2));
        expect(result.current.getState().count).toBe(2);
    });
});
