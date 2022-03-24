import React, { useState } from "react";
import { Box, Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import { auth } from "../Auth/firebase";

const Logout = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      component="span"
      sx={{
        position: "absolute",
        right: { md: 50, xs: 0 },
      }}
    >
      <IconButton
        id="menu-button"
        aria-controls={open ? "menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
        sx={{ padding: 0 }}
      >
        <Avatar src={user.photoURL} />
      </IconButton>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "menu-button",
        }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            auth.signOut();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Logout;
