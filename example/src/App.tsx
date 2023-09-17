import { useGlobalStore, useStoreState } from "../../src/stores";
import "./App.css";

interface AppStore {
  name: string;
  countOne: number;
  countTwo: number;
}

function DataCard() {
  const store = useGlobalStore<AppStore>("app");
  const [name] = useStoreState(store, "name");
  const [countOne] = useStoreState(store, "countOne");
  const [countTwo] = useStoreState(store, "countTwo");

  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Count A: {countOne}</p>
      <p>Count B: {countTwo}</p>
    </div>
  );
}

function App() {
  const store = useGlobalStore<AppStore>("app", {
    name: "John Doe",
    countOne: 0,
    countTwo: 0,
  });
  const [name, setName] = useStoreState(store, "name");
  const [countOne, setCountOne] = useStoreState(store, "countOne");
  const [countTwo, setCountTwo] = useStoreState(store, "countTwo");

  return (
    <>
      <h1>React Stores</h1>
      <div className="card">
        <button
          onClick={() => setName(name === "John Doe" ? "Jane Doe" : "John Doe")}
        >
          Name is {name}
        </button>
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
