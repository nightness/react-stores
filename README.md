# Global Store for React

A simple and lightweight global state management solution for React applications.

## Installation

This is a code snippet, so there's no installation required. Simply copy and paste the code into your project.

## Usage

The provided code offers a way to create and manage global state in React applications. It provides both local and global store hooks.

### API

- `useCreateGlobalStore(namespace: string, initialState: T)`: Creates a global store or retrieves an existing one based on the provided namespace.
- `createStore(initialState: T)`: Creates a local store.
- `useCreateStore(initialState: T)`: React hook to create a local store.
- `useStore(store: Store<T>, key: K)`: React hook to use a local store in a component.
- `useGlobalStore(namespace: string, key: K)`: React hook to use a global store in a component.

### Example

```typescript
interface PlaygroundStore {
  name: string;
  countOne: number;
  countTwo: number;
}

function Playground({ children }: { children?: React.ReactNode }) {
  const store = useCreateStore<PlaygroundStore>({
    name: "Your Name",
    countOne: 0,
    countTwo: 0,
  });
  const [name, setName] = useStore(store, "name");
  const [countOne, setCountOne] = useStore(store, "countOne");
  const [countTwo, setCountTwo] = useStore(store, "countTwo");

  return (
    ...
  );
}
```

## License

MIT License
