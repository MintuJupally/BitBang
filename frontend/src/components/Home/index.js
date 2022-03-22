import clsx from "clsx";
import { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  Grid,
  Hidden,
  Menu,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { KeyboardArrowDownRounded } from "@mui/icons-material";

import Graph from "./Graph";

import btc from "../../assets/images/btc.svg";
import doge from "../../assets/images/doge.svg";
import eth from "../../assets/images/eth.svg";
import shib from "../../assets/images/shib.svg";
import solana from "../../assets/images/solana.svg";
import tron from "../../assets/images/tron.svg";
import xrp from "../../assets/images/xrp.svg";

const useStyles = makeStyles({
  card: {
    display: "flex",
    padding: "10px",
    alignItems: "center",
    margin: "10px 0px",
    boxShadow: "0px 0px 25px 2px rgb(200,200,200,0.3)",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0px 0px 15px 2px rgb(66, 148, 237, 0.3)",
    },
    transition: "box-shadow 0.2s ease-in-out",
  },
});

const coins = [
  { name: "Bitcoin", img: btc },
  { name: "Ethereum", img: eth },
  { name: "Dogecoin", img: doge },
  { name: "Shiba inu", img: shib },
  { name: "Solana", img: solana },
  { name: "TRON", img: tron },
  { name: "XRP", img: xrp },
];

const Home = () => {
  const classes = useStyles();

  const [currentCoin, setCurrentCoin] = useState(0);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <div style={{ marginTop: "15px" }}>
      <Grid container spacing={1} style={{ justifyContent: "space-around" }}>
        <Grid item xs={12} md={3}>
          <Hidden mdDown>
            {coins.map((coin, index) => (
              <Card
                key={"coin-" + (index + 1)}
                className={classes.card}
                style={{
                  backgroundColor:
                    index === currentCoin ? "rgb(230,230,230)" : "white",
                }}
                onClick={() => {
                  setCurrentCoin(index);
                }}
              >
                <div>
                  <Avatar src={coin.img} />
                </div>
                <div>
                  <Typography
                    style={{
                      marginLeft: "15px",
                      fontSize: "18px",
                      fontWeight: 500,
                    }}
                  >
                    {coin.name}
                  </Typography>
                </div>
              </Card>
            ))}
          </Hidden>
          <Hidden mdUp>
            <Card
              id="width-ref-card"
              className={classes.card}
              onClick={(event) => {
                setAnchorEl(event.currentTarget);
                setOpen(true);
              }}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <Avatar src={coins[currentCoin].img} />
                </div>
                <div>
                  <Typography
                    style={{
                      marginLeft: "15px",
                      fontSize: "18px",
                      fontWeight: 500,
                    }}
                  >
                    {coins[currentCoin].name}
                  </Typography>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <KeyboardArrowDownRounded />
              </div>
            </Card>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={() => {
                setOpen(false);
              }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {coins.map((coin, index) => (
                <MenuItem
                  key={"coin-" + (index + 1)}
                  onClick={() => {
                    setCurrentCoin(index);
                    setOpen(false);
                  }}
                >
                  <Card
                    className={classes.card}
                    style={{
                      backgroundColor:
                        index === currentCoin
                          ? "rgb(230,230,230)"
                          : "transparent",
                      width: `${
                        document.getElementById("width-ref-card")?.offsetWidth
                      }px`,
                      boxShadow: "0px 0px 0px 0px black",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    <div>
                      <Avatar src={coin.img} />
                    </div>
                    <div>
                      <Typography
                        style={{
                          marginLeft: "15px",
                          fontSize: "18px",
                          fontWeight: 500,
                        }}
                      >
                        {coin.name}
                      </Typography>
                    </div>
                  </Card>
                </MenuItem>
              ))}
            </Menu>
          </Hidden>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card style={{ boxShadow: "0px 0px 25px 2px rgb(200,200,200,0.3)" }}>
            <Graph name={coins[currentCoin].name} />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
