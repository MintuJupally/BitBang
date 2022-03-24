import React from "react";
import { signInWithGoogle } from "./firebase.js";
import { Button, Box } from "@mui/material";

const Login = () => {
	return (
		<Box style={{ marginTop: 200 }}>
			<Button
				variant="contained"
				style={{ backgroundColor: "white", color: "black" }}
				onClick={signInWithGoogle}
			>
				<img
					src={"https://cdn-icons-png.flaticon.com/512/2991/2991148.png"}
					style={{ height: 30, marginRight: 10 }}
				/>
				Sign In with Google
			</Button>
		</Box>
	);
};

export default Login;
