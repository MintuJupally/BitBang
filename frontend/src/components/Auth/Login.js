import React from "react";
import { auth, signInWithGoogle } from "./firebase.js";

const Login = () => {
	// Sign in with google
	// const signin = () => {
	// 	auth.signInWithPopup(provider).catch(alert);
	// };

	return (
		<div>
			<center>
				<button style={{ marginTop: "200px" }} onClick={signInWithGoogle}>
					Sign In with Google
				</button>
			</center>
		</div>
	);
};

export default Login;
