import React from "react";
import { signInWithGoogle } from "./firebase.js";
import { Button, Typography } from "@mui/material";
import Tilt from "react-parallax-tilt";
import img from "../../assets/bitcoin.jpg";
import google from "../../assets/images/Google.png";
import eslogo from "../../assets/es_logo.png";
import "./login.css";

const Login = () => {
  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="logo">
          <a
            href="https://e-summit-iitbbs.com"
            target="_blank"
            rel="noreferrer"
          >
            <img src={eslogo} alt="ES' 22" />
          </a>
        </div>
        <div
          className="wrap-login100"
          style={{
            padding: 60,
            alignItems: "center",
            justifyContent: "space-around",
            boxShadow: "0px 0px 25px 5px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="login100-pic js-tilt"
            data-tilt
            // style={{ padding: 60 }}
          >
            <Tilt scale={1.1} tiltReverse={true} style={{ width: "200px" }}>
              <img src={img} alt="IMG" className="bitcoing_img" />
            </Tilt>
          </div>
          <form className="login100-form validate-form">
            <Typography
              variant="h4"
              style={{ color: "black", marginBottom: "30px" }}
            >
              BitBang
            </Typography>
            <Button
              variant="contained"
              style={{
                backgroundColor: "white",
                color: "black",
                marginBottom: "30px",
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

export default Login;
