import { useRoutes } from "react-router-dom";
import setRoutes from "./routes";
import { auth } from "./components/Auth/firebase";
import {useAuthState} from 'react-firebase-hooks/auth';
import "./App.css";

function App() {
  const [user, initialising] = useAuthState(auth);
  const routing = useRoutes(setRoutes(user, initialising));

  return <div className="App">{routing}</div>;
}

export default App;
