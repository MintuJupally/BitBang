import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, Typography, CircularProgress } from "@mui/material";
import Logout from "../Auth/Logout";

const Layout = ({ user, loading }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClose = () => {
		setAnchorEl(null);
	};
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
						<Typography
							variant="h4"
							component="span"
							sx={{
								position: {
									xs: `${user ? "absolute" : "inherit"}`,
									md: "inherit",
								},
								left: { xs: 16 },
							}}
						>
							BITBANG
						</Typography>
						{user && <Logout user={user} />}
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
