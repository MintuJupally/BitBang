import { Outlet } from "react-router-dom";
import { Container, Typography } from "@mui/material";

const Layout = () => {
  return (
    <div>
      <header
        style={{
          display: "flex",
          padding: "10px 0px",
          position: "fixed",
          backgroundColor: "white",
          width: "100vw",
          zIndex: 100,
        }}
      >
        <Container>
          <div>
            <Typography variant="h4">BITBANG</Typography>
          </div>
        </Container>
      </header>
      <Container>
        <div style={{ paddingTop: "70px" }}>
          <Outlet />
        </div>
      </Container>
    </div>
  );
};

export default Layout;
