import clsx from "clsx";
import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Hidden,
  Menu,
  MenuItem,
  Modal,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ArrowCircleDown, KeyboardArrowDownRounded } from "@mui/icons-material";

import Graph from "./Graph";
import InfoCard from "./InfoCard";

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
  { name: "Bitcoin", img: btc, curr: "BTC" },
  { name: "Ethereum", img: eth, curr: "ETH" },
  { name: "Dogecoin", img: doge, curr: "DOGE" },
  { name: "Shiba inu", img: shib, curr: "SHIB" },
  { name: "Solana", img: solana, curr: "SOL" },
  { name: "Tron", img: tron, curr: "TRX" },
  { name: "Ripple", img: xrp, curr: "XRP" },
];

const Home = () => {
  const classes = useStyles();

  const [currentCoin, setCurrentCoin] = useState(0);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleModalClose = () => {
    console.log("clicked");
    setModalOpen(false);
  };

  return (
    <div style={{ margin: "15px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
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
        <Grid item xs={12} md={7}>
          <Card
            style={{
              boxShadow: "0px 0px 25px 2px rgb(200,200,200,0.3)",
              marginTop: "10px",
            }}
          >
            <Graph name={coins[currentCoin].name} />
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card
            className={classes.card}
            style={{
              flexDirection: "column",
              maxHeight: "400px",

              padding: "10px",
            }}
          >
            <Typography style={{ fontSize: "19px" }}>TRADE HISTORY</Typography>
            <Divider />
            <div style={{ overflow: "auto" }} className="hist-card">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((el, index) => (
                <>
                  <div
                    key={"hist-" + index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      margin: "8px 0px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div>
                        <ArrowCircleDown
                          style={{
                            color: "lightgreen",
                            fontSize: "30px",
                            marginRight: "5px",
                          }}
                        />
                      </div>
                      <div style={{ textAlign: "left" }}>
                        Day 1<br />
                        09:29 PM
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Typography>16.845 MANA</Typography>
                    </div>
                  </div>
                  <Divider
                    style={{
                      height: "0.4px",
                      width: "calc(90% - 20px)",
                      position: "relative",
                      left: "10px",
                      right: "10px",
                      display: "block",
                      margin: "auto",
                      background: "rgb(0,0,255,0.1)",
                    }}
                  />
                </>
              ))}
            </div>
          </Card>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              variant="contained"
              style={{ backgroundColor: "rgb(31, 147, 88)", width: "120px" }}
            >
              BUY {coins[currentCoin].curr}
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "rgb(224, 77, 91)", width: "120px" }}
            >
              SELL {coins[currentCoin].curr}
            </Button>
          </div>
        </Grid>
      </Grid>
      <div
        style={{
          display: "flex",
          position: "fixed",
          bottom: 0,
          backgroundColor: "rgb(230, 230, 230)",
          width: "calc(100% - 20vw)",
          margin: "0 10vw",
          left: 0,
          justifyContent: "center",
          height: "100px",
          alignItems: "center",
          borderRadius: "30px",
          cursor: "pointer",
          // borderTopLeftRadius: "30px",
          // borderTopRightRadius: "30px",
        }}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        {/* <div
          style={{
            position: "absolute",
            backgroundColor: "rgb(200,200,200)",
            height: "5px",
            width: "40px",
          }}
        ></div> */}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div style={{ width: "100px", marginRight: "40px" }}>
            <div>
              <Typography
                style={{
                  fontSize: "13px",
                  color: "rgb(120,120,120)",
                  padding: 0,
                  margin: 0,
                  textAlign: "center",
                }}
              >
                CURRENT
              </Typography>
            </div>
            <div>
              <Typography style={{ fontSize: "24px", textAlign: "center" }}>
                ₹3,180.18
              </Typography>
            </div>
          </div>
          <div style={{ width: "100px", marginRight: "40px" }}>
            <div>
              <Typography
                style={{
                  fontSize: "13px",
                  color: "rgb(120,120,120)",
                  padding: 0,
                  margin: 0,
                  textAlign: "center",
                }}
              >
                INVESTED
              </Typography>
            </div>
            <div>
              <Typography style={{ fontSize: "24px", textAlign: "center" }}>
                ₹5,000.08
              </Typography>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Avatar
            src={coins[currentCoin].img}
            style={{ height: "60px", width: "60px", margin: "0px 20px" }}
          />
          <Typography>{coins[currentCoin].curr}</Typography>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div style={{ width: "100px", marginLeft: "40px" }}>
            <div>
              <Typography
                style={{
                  fontSize: "13px",
                  color: "rgb(120,120,120)",
                  padding: 0,
                  margin: 0,
                  textAlign: "center",
                }}
              >
                OWNED
              </Typography>
            </div>
            <div>
              <Typography style={{ fontSize: "24px", textAlign: "center" }}>
                16.845
              </Typography>
            </div>
          </div>
          <div style={{ width: "100px", marginLeft: "40px" }}>
            <div>
              <Tooltip title="Current Buying Price" placement="top" arrow>
                <Typography
                  style={{
                    fontSize: "13px",
                    color: "rgb(120,120,120)",
                    padding: 0,
                    margin: 0,
                    textAlign: "center",
                    cursor: "default",
                  }}
                >
                  CBP
                </Typography>
              </Tooltip>
            </div>
            <div>
              <Typography style={{ fontSize: "24px", textAlign: "center" }}>
                ₹188.78
              </Typography>
            </div>
          </div>
        </div>

        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              // border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              outline: "none",
            }}
          >
            <InfoCard data={coins[currentCoin]} />
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
