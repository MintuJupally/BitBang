import { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios";
import setRoutes from "./routes";
import { auth } from "./components/Auth/firebase";
import "./App.css";

function App() {
	const [userData, setUserData] = useState(null);
	const [user, initialising] = useAuthState(auth);
	const routing = useRoutes(setRoutes(userData, initialising));

	useEffect(() => {
		console.log(user);
		auth?.currentUser
			?.getIdToken()
			.then((idToken) => {
				axios
					.post("/api/auth/login", {
						token: idToken,
					})
					.then((res) => {
						console.log(res);
						setUserData({
							...res.data,
							name: user.displayName,
							photoURL: user.photoURL,
						});
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((error) => {
				console.log(error);
			});
	}, [user]);

	return <div className="App">{routing}</div>;
}

export default App;
