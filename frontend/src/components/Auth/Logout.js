import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Typography,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  AdminPanelSettingsOutlined,
  HomeOutlined,
  Logout,
  PriceChange,
} from "@mui/icons-material";

import { auth } from "../Auth/firebase";
import showPrice from "../../utils/showPrice";

const NavMenu = ({ user }) => {
  const navigate = useNavigate();

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
        right: { md: 50, xs: 20 },
        top: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {user.isRegistered ? (
        <Typography style={{ paddingRight: "10px", fontSize: "18px" }}>
          {showPrice(user.wallet)}
        </Typography>
      ) : (
        <Tooltip title="Not Registered" arrow>
          <Typography
            style={{
              marginRight: "10px",
              fontSize: "18px",
              cursor: "default",
            }}
          >
            NR
          </Typography>
        </Tooltip>
      )}
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
            navigate("/home");
            handleClose();
          }}
        >
          <ListItemIcon>
            <HomeOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </MenuItem>
        {user.isRegistered && (
          <MenuItem
            onClick={() => {
              navigate("/portfolio");
              handleClose();
            }}
          >
            <ListItemIcon>
              <PriceChange fontSize="small" />
            </ListItemIcon>
            <ListItemText>Portfolio</ListItemText>
          </MenuItem>
        )}
        {user.admin && (
          <MenuItem
            onClick={() => {
              navigate("/admin");
              handleClose();
            }}
          >
            <ListItemIcon>
              <AdminPanelSettingsOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>Admin</ListItemText>
          </MenuItem>
        )}
        <Divider />
        <MenuItem
          onClick={() => {
            auth.signOut();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default NavMenu;
