# Global Store for React

A simple and lightweight global state management solution for React and React Native applications, it replaces useState. Offering a way to create and manage local and global state in React applications.

## Installation

```bash
npm install @nightness/react-stores

# or

yarn add @nightness/react-stores
```

### API

- `useCreateGlobalStore(namespace: string, initialState: T)`: Creates a global store or retrieves an existing one based on the provided namespace.
- `useGlobalStore(namespace: string, key: K)`: React hook to use a global store in a component.

- `useCreateStore(initialState: T)`: React hook to create a local store.
- `useStore(store: Store<T>, key: K)`: React hook to use a local store in a component.

### Example

There is an example project in the `example` folder. The following is a simple example of how to use the library.

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
