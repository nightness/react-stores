import {
  useCreateGlobalStore,
  useGlobalStore,
  useStore,
} from "../../src/useStores";
import "./App.css";

interface AppStore {
  name: string;
  countOne: number;
  countTwo: number;
}

function DataCard() {
  const [name] = useGlobalStore<AppStore, "name">("app", "name");
  const [countOne] = useGlobalStore<AppStore, "countOne">("app", "countOne");
  const [countTwo] = useGlobalStore<AppStore, "countTwo">("app", "countTwo");

  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Count A: {countOne}</p>
      <p>Count B: {countTwo}</p>
    </div>
  );
}

function App() {
  const store = useCreateGlobalStore<AppStore>("app", {
    name: "Your Name",
    countOne: 0,
    countTwo: 0,
  });
  const [name, setName] = useStore(store, "name");
  const [countOne, setCountOne] = useStore(store, "countOne");
  const [countTwo, setCountTwo] = useStore(store, "countTwo");

  return (
    <>
      <h1>React Stores</h1>
      <div className="card">
        <button onClick={() => setName("John Doe")}>Name is {name}</button>
        <button onClick={() => setCountOne(countOne + 1)}>
          Count A (+1) is {countOne}
        </button>
        <button
          onClick={() => {
            setCountTwo(store.getState().countTwo + 1);
            setCountTwo(store.getState().countTwo + 1);
          }}
        >
          Count B (+2) is {countTwo}
        </button>
        <DataCard />
      </div>
    </>
  );
}

export default App;
