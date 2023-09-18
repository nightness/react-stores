# Stores for React (@josh.guyette/react-stores)

A simple and lightweight global and local state management solution for React and React Native applications.

## Installation

```bash
npm install @josh.guyette/react-stores

# or

yarn add @josh.guyette/react-stores
```

### API

- `useGlobalStore(namespace: string, initialState?: T)`: Retrieves an existing global store or creates a new one with the initialState; for the provided namespace.
- `useLocalStore(initialState: T)`: React hook to create a local store.
- `useStoreState(store: Store<T>, key: K)`: React hook to use a local store in a component.

### Example

There is an example project in the `example` folder. The following is a simple example of how to use the library.

```typescript
interface PlaygroundStore {
  name: string;
  countOne: number;
  countTwo: number;
}

function Playground({ children }: { children?: React.ReactNode }) {
  const store = useLocalStore<PlaygroundStore>({
    name: "Your Name",
    countOne: 0,
    countTwo: 0,
  });
  const [name, setName] = useStoreState(store, "name");
  const [countOne, setCountOne] = useStoreState(store, "countOne");
  const [countTwo, setCountTwo] = useStoreState(store, "countTwo");

  return (
    ...
  );
}
```

## License

MIT License
