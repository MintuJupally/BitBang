import { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios";
import { doc, onSnapshot } from "firebase/firestore";

import { auth, db } from "./components/Auth/firebase";
import setRoutes from "./routes";
import "./App.css";

let unsubscribe = null;
function App() {
  const [userData, setUserData] = useState(null);
  const [user, initialising] = useAuthState(auth);
  const [load, setLoad] = useState(true);
  const routing = useRoutes(setRoutes(userData, load || initialising));

  const listenToUserDoc = (id) => {
    if (unsubscribe) unsubscribe();

    unsubscribe = onSnapshot(doc(db, "users", id), (doc) => {
      console.log(doc.data());
      setUserData({ ...userData, ...doc.data() });
    });
  };

  useEffect(() => {
    console.log({ user });

    if (!user && !initialising) {
      setUserData(null);
      setLoad(false);
      return;
    }

    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    auth?.currentUser
      ?.getIdToken()
      .then((idToken) => {
        axios
          .post("/api/auth/login", {
            token: idToken,
          })
          .then((res) => {
            console.log({ res, user });
            setUserData({
              ...res.data,
              name: user.displayName,
              photoURL: user.photoURL,
              token: idToken,
              id: user.uid,
            });
          })
          .catch((err) => {
            console.log(err);

            setLoad(false);
          });
      })
      .catch((error) => {
        console.log(error);

        setLoad(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user && !initialising) {
      setUserData(null);
      setLoad(false);
      return;
    }
  }, [initialising]);

  useEffect(() => {
    if (userData) {
      setLoad(false);
      if (!unsubscribe) listenToUserDoc(userData.id);
    }
  }, [userData]);

  return <div className="App">{routing}</div>;
}

export default App;
