import { useGlobalStore, useLocalStore, useStoreState } from "../../src/stores";
import "./App.css";

export interface AppStore {
  countOne: number;
  countTwo: number;
}

interface LocalStore {
  data: {
    name: string;
  };
}

function DataCard() {
  const store = useGlobalStore<AppStore>("app");
  const [countOne] = useStoreState(store, "countOne");
  const [countTwo] = useStoreState(store, "countTwo");

  return (
    <div className="card">
      <p>Count A: {countOne}</p>
      <p>Count B: {countTwo}</p>
    </div>
  );
}

function App() {
  const store = useGlobalStore<AppStore>("app", {
    countOne: 0,
    countTwo: 0,
  });
  const localStore = useLocalStore<LocalStore>({
    data: {
      name: "John Doe",
    },
  });
  const [countOne, setCountOne] = useStoreState(store, "countOne");
  const [countTwo, setCountTwo] = useStoreState(store, "countTwo");
  const [data, setData] = useStoreState(localStore, "data");

  return (
    <>
      <h1>React Stores</h1>
      <div className="card">
        <button
          onClick={() =>
            setData({
              ...data,
              name: data.name === "John Doe" ? "Jane Doe" : "John Doe",
            })
          }
        >
          Name is {data.name}
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
