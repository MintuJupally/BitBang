import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container, Typography, CircularProgress } from "@mui/material";
import NavMenu from "../Auth/Logout";

const Layout = ({ user, loading }) => {
  const navigate = useNavigate();

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
        }}
      >
        <CircularProgress />
      </div>
    );

  return (
    <div>
      {user && (
        <header
          style={{
            display: "flex",
            padding: "10px 0px",
            position: "fixed",
            backgroundColor: "white",
            width: "100vw",
            zIndex: 100,
            height: "60px",
            boxShadow: "0px 5px 15px 3px rgb(200,200,200,0.3)",
          }}
        >
          <Container>
            <div>
              <Typography
                variant="h4"
                component="span"
                id="main-title"
                sx={{
                  position: {
                    xs: `${user ? "absolute" : "inherit"}`,
                    md: "inherit",
                  },
                  left: { xs: 16 },
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate("/");
                }}
              >
                BITBANG
              </Typography>
              {user && <NavMenu user={user} />}
            </div>
          </Container>
        </header>
      )}
      <div style={{ paddingTop: user ? "70px" : "0px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
