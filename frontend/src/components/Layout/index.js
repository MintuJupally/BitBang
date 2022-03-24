import { Outlet } from "react-router-dom";
import {
	Button,
	Container,
	Typography,
	Grid,
	CircularProgress,
} from "@mui/material";
import { auth } from "../Auth/firebase";

const Layout = ({ user, loading }) => {
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
						<Typography variant="h4" component="span">BITBANG</Typography>
						<Button variant="contained" sx={{position:{xs:"relative", md:"absolute"}, right:50}}>User</Button>
					</div>
				</Container>
			</header>
			<div style={{ paddingTop: "70px" }}>
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;
