import { useRoutes } from "react-router-dom";
import setRoutes from "./routes";
import "./App.css";

function App() {
  const routing = useRoutes(setRoutes());

  return <div className="App">{routing}</div>;
}

export default App;
