import React, { useState, useEffect } from "react";
import { signInWithGoogle } from "./firebase.js";
import { Button, Box, Container, Typography } from "@mui/material";
import Tilt from "react-parallax-tilt";
import img from "../../assets/bitcoin.jpg";
import google from "../../assets/images/Google.png";
import "./login.css";

let angle = 0;
const Login = () => {
	const [rindex, setRindex] = useState(0);

	// useEffect(() => {
	// 	angle = (angle + 90) % 360;
	// 	setTimeout(() => {
	// 		console.log(angle);
	// 		setRindex((rindex + 1) % 3);
	// 	}, 3000);
	// }, [rindex]);

	return (
		<div className="limiter">
			<div className="container-login100">
				<div
					className="wrap-login100"
					style={{ padding: "30px", alignItems: "center" }}
				>
					<div
						className="login100-pic js-tilt"
						data-tilt
						style={{ padding: 60 }}
					>
						<Tilt scale={1.1} tiltReverse={true}>
							<img src={img} alt="IMG" className="bitcoing_img" />
						</Tilt>
					</div>
					<form className="login100-form validate-form">
						<Button
							variant="contained"
							style={{
								backgroundColor: "white",
								color: "black",
								fontSize: 20,
							}}
							onClick={signInWithGoogle}
						>
							<img
								src={google}
								alt="Google"
								style={{ width: 30, height: 30, marginRight: 10 }}
							/>
							Sign in with google
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

const styles = {
	box: {
		backgroundColor: "rgba(133, 255, 249)",
		height: "90vh",
	},
};

export default Login;
