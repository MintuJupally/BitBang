import { useState, useEffect, Fragment } from "react";
import axios from "axios";

import { collection, query, doc, where, onSnapshot } from "firebase/firestore";
import { db } from "../Auth/firebase";

import { makeStyles } from "@mui/styles";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CircularProgress,
  Divider,
  Grid,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowCircleUp,
  ArrowCircleDown,
  KeyboardArrowDownRounded,
  Close,
} from "@mui/icons-material";

import Graph from "./Graph";
import InfoCard from "./InfoCard";
import { showPrice, isDecimal, roundTo } from "../../utils";
import { BACKEND_URL } from "../../constants";

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

let unsubscribeTransactions = null;

const coins = [
  { name: "Bitcoin", img: btc, curr: "BTC" },
  { name: "Ethereum", img: eth, curr: "ETH" },
  { name: "Dogecoin", img: doge, curr: "DOGE" },
  { name: "Shiba inu", img: shib, curr: "SHIB" },
  { name: "Solana", img: solana, curr: "SOL" },
  { name: "Tron", img: tron, curr: "TRX" },
  { name: "Ripple", img: xrp, curr: "XRP" },
];

const Home = ({ user }) => {
  const classes = useStyles();

  const [prices, setPrices] = useState([]);
  const [coinIndex, setCoinIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [tradeModalOpen, setTradeModalOpen] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [money, setMoney] = useState("");
  const [numCoins, setNumCoins] = useState("");
  const [processing, setProcessing] = useState(false);

  const [currentCoin, setCurrentCoin] = useState(null);
  const [status, setStatus] = useState(null);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleTradeModalClose = () => {
    setTradeModalOpen(0);
  };

  const performTransaction = () => {
    setProcessing(true);

    axios
      .post(BACKEND_URL + "api/trade", {
        money: parseFloat(money),
        coins: parseFloat(numCoins),
        curr: currentCoin?.curr,
        type: tradeModalOpen,
        t: currentCoin?.prices?.[currentCoin?.prices?.length - 1]?.[0],
        token: user.token,
      })
      .then((res) => {
        console.log(res);

        setProcessing(false);
      })
      .catch((err) => {
        console.log(err);

        setProcessing(false);
      });
  };

  useEffect(() => {
    if (tradeModalOpen === 0) {
      setMoney("");
      setNumCoins("");
    }
  }, [tradeModalOpen]);

  useEffect(() => {
    const ref = collection(db, "values");
    const unsubscribeValues = onSnapshot(ref, (data) => {
      const vals = data.docs
        .map((el) => el.data())
        .sort((a, b) => {
          return a.time - b.time;
        })
        .map((el) => [el.time, el.val]);

      setPrices(vals);
    });

    const unsubscribeEvents = onSnapshot(doc(db, "event", "start"), (data) => {
      setStatus(data.data());
    });

    return () => {
      unsubscribeValues();
      unsubscribeEvents();
    };
  }, []);

  useEffect(() => {
    setCurrentCoin({
      ...currentCoin,
      ...coins[coinIndex],
      prices: prices.map((el) => [el[0], el[1][coinIndex]]),
    });

    if (tradeModalOpen) {
      const current =
        currentCoin?.prices?.[currentCoin?.prices?.length - 1]?.[1];

      if (money !== "" && parseFloat(money) !== 0)
        setNumCoins((parseFloat(money) / current).toString());
    }
  }, [prices, coinIndex]);

  useEffect(() => {
    if (currentCoin) {
      if (unsubscribeTransactions) {
        unsubscribeTransactions();
        unsubscribeTransactions = null;
      }

      const q = query(
        collection(db, "transactions"),
        where("user", "==", user.id),
        where("curr", "==", currentCoin?.curr)
      );

      unsubscribeTransactions = onSnapshot(q, (querySnapshot) => {
        const hist = [];
        querySnapshot.forEach((doc) => {
          hist.push(doc.data());
        });

        setTransactions(hist.sort((a, b) => b.time - a.time));
      });
    }

    return () => {
      if (unsubscribeTransactions) {
        unsubscribeTransactions();
        unsubscribeTransactions = null;
      }
    };
  }, [currentCoin]);

  let current = currentCoin?.prices?.[currentCoin?.prices?.length - 1]?.[1];

  if (!current) current = 0;
  const owned = transactions.reduce(
    (prev, cur) => prev - cur.coins * cur.type,
    0
  );
  const invested = transactions.reduce(
    (prev, cur) => prev - cur.money * cur.type,
    0
  );

  return (
    <div style={{ margin: "15px" }}>
      <Grid container spacing={2} style={{ marginBottom: "120px" }}>
        <Grid item xs={12} md={2}>
          <Hidden mdDown>
            {coins.map((coin, index) => (
              <Card
                key={"coin-" + (index + 1)}
                className={classes.card}
                style={{
                  backgroundColor:
                    index === coinIndex ? "rgb(230,230,230)" : "white",
                }}
                onClick={() => {
                  setCoinIndex(index);
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
                  <Avatar src={currentCoin?.img} />
                </div>
                <div>
                  <Typography
                    style={{
                      marginLeft: "15px",
                      fontSize: "18px",
                      fontWeight: 500,
                    }}
                  >
                    {currentCoin?.name}
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
                    setCoinIndex(index);
                    setOpen(false);
                  }}
                >
                  <Card
                    className={classes.card}
                    style={{
                      backgroundColor:
                        index === coinIndex
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
            <Graph name={currentCoin?.name} data={currentCoin?.prices} />
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
            <div
              style={{
                overflow: "auto",
                maxHeight: "300px",
                display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                flexDirection: "column",
              }}
              className="hist-card"
            >
              {transactions?.length > 0 &&
                transactions?.map((el, index) => (
                  <Fragment key={"hist-" + index}>
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
                          {el.type > 0 ? (
                            <ArrowCircleUp
                              style={{
                                color: "rgb(230,0,0)",
                                fontSize: "30px",
                                marginRight: "5px",
                              }}
                            />
                          ) : (
                            <ArrowCircleDown
                              style={{
                                color: "lightgreen",
                                fontSize: "30px",
                                marginRight: "5px",
                              }}
                            />
                          )}
                        </div>
                        <div style={{ textAlign: "left" }}>
                          Day {parseInt(el.t / 10)}
                          <br />
                          Hour {el.t % 10}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Tooltip
                          title={`${roundTo(el.coins, 5)} ${el.curr}`}
                          arrow
                          placement="top-end"
                        >
                          <Typography>
                            {roundTo(el.coins, 4)} {el.curr}
                          </Typography>
                        </Tooltip>
                      </div>
                    </div>
                    {transactions.length - 1 !== index && (
                      <Divider
                        style={{
                          height: "0.4px",
                          width: "calc(90% - 20px)",
                          position: "relative",
                          left: "10px",
                          right: "10px",
                          display: "block",
                          margin: "0px auto",
                          background: "rgb(0,0,255,0.1)",
                        }}
                      />
                    )}
                  </Fragment>
                ))}
              {transactions.length === 0 && (
                <div style={{ padding: "20px 0px" }}>
                  <Typography>Nothing to show</Typography>
                </div>
              )}
            </div>
          </Card>
          {user?.isRegistered &&
            currentCoin?.prices?.[currentCoin?.prices?.length - 1]?.[0] >= 10 &&
            !status?.stop && (
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "rgb(31, 147, 88)",
                    width: "120px",
                  }}
                  onClick={() => {
                    setTradeModalOpen(-1);
                  }}
                >
                  BUY {currentCoin?.curr}
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "rgb(224, 77, 91)",
                    width: "120px",
                  }}
                  onClick={() => {
                    setTradeModalOpen(1);
                  }}
                >
                  SELL {currentCoin?.curr}
                </Button>
              </div>
            )}
        </Grid>
      </Grid>
      <Box
        style={{
          display: "flex",
          position: "fixed",
          bottom: 0,
          backgroundColor: "rgb(230, 230, 230)",
          width: "calc(100% - 20vw)",
          margin: "0 10vw",
          left: 0,
          justifyContent: "center",
          alignItems: "center",
          cursor: user.isRegistered ? "pointer" : "default",
          // borderRadius: "30px",
          borderTopLeftRadius: "30px",
          borderTopRightRadius: "30px",
          boxShadow: "0px 15px 15px 2px rgb(150,150,150,1)",
        }}
        sx={{ height: { xs: "80px", md: "100px" } }}
        onClick={() => {
          if (user.isRegistered) setModalOpen(true);
        }}
      >
        {user.isRegistered && (
          <Hidden mdDown>
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
                    {showPrice(owned * current)}
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
                  <Typography
                    style={{
                      fontSize: "24px",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {showPrice(invested)}
                  </Typography>
                </div>
              </div>
            </div>
          </Hidden>
        )}
        {user.isRegistered ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Avatar
              src={currentCoin?.img}
              style={{ height: "60px", width: "60px", margin: "0px 20px" }}
            />
            <Hidden mdDown>
              <Typography>{currentCoin?.curr}</Typography>
            </Hidden>
          </div>
        ) : (
          <div>
            <Typography
              variant="h5"
              style={{ color: "rgb(230,0,0)", marginRight: "40px" }}
            >
              NOT REGISTERED
            </Typography>
          </div>
        )}
        {user.isRegistered && (
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
                  {roundTo(owned, 2)}
                </Typography>
              </div>
            </div>

            <Hidden mdDown>
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
                    {showPrice(current)}
                  </Typography>
                </div>
              </div>
            </Hidden>
          </div>
        )}
      </Box>
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
          <InfoCard data={{ ...currentCoin, current, owned, invested }} />
        </Box>
      </Modal>
      <Modal
        open={Boolean(tradeModalOpen)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(400px, 95vw)",
            // border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          <Card
            sx={{
              maxWidth: "min(400px, 95vw)",
              boxShadow: "0px 0px 15px 5px rgb(200,200,200,0.7)",
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <IconButton
              style={{ position: "absolute", top: 5, right: 5 }}
              onClick={handleTradeModalClose}
            >
              <Close />
            </IconButton>
            <Typography style={{ paddingBottom: "10px" }}>
              Enter the amount you want to{" "}
              <b>{tradeModalOpen > 0 ? "sell" : "buy"}</b>
            </Typography>
            <div style={{ padding: "5px" }}>
              <TextField
                autoComplete="off"
                disabled={processing}
                label="Rupees"
                value={money}
                onChange={(event) => {
                  let val = event.target.value;
                  if (val === "") {
                    setMoney("");
                    setNumCoins("");
                  } else if (isDecimal(val)) {
                    setMoney(val);
                    setNumCoins((parseFloat(val) / current).toString());
                  }
                }}
              ></TextField>
            </div>
            <div style={{ padding: "5px" }}>
              <TextField
                autoComplete="off"
                disabled={processing}
                label={currentCoin?.curr}
                value={numCoins}
                onChange={(event) => {
                  let val = event.target.value;
                  if (val === "") {
                    setMoney("");
                    setNumCoins("");
                  } else if (isDecimal(val)) {
                    setNumCoins(val);
                    setMoney((parseFloat(val) * current).toString());
                  }
                }}
              ></TextField>
            </div>
            <Typography style={{ color: "rgb(210, 0, 0)", marginTop: "10px" }}>
              {tradeModalOpen < 0 && parseFloat(money) > user.wallet
                ? "Cannot trade more than wallet amount"
                : tradeModalOpen > 0 && parseFloat(numCoins) > owned
                ? "Cannot trade more coins than you own"
                : ""}
            </Typography>
            <CardActions>
              {!processing ? (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor:
                      money === "" ||
                      parseFloat(money) === 0 ||
                      (tradeModalOpen < 0 && parseFloat(money) > user.wallet) ||
                      (tradeModalOpen > 0 && parseFloat(numCoins) > owned)
                        ? "lightgrey"
                        : tradeModalOpen > 0
                        ? "rgb(224, 77, 91)"
                        : "rgb(31, 147, 88)",
                    width: "130px",
                  }}
                  disabled={
                    money === "" ||
                    parseFloat(money) === 0 ||
                    (tradeModalOpen < 0 && parseFloat(money) > user.wallet) ||
                    (tradeModalOpen > 0 && parseFloat(numCoins) > owned)
                  }
                  onClick={performTransaction}
                >
                  CONFIRM {tradeModalOpen > 0 ? "SELL" : "BUY"}
                </Button>
              ) : (
                <CircularProgress />
              )}
            </CardActions>
          </Card>
        </Box>
      </Modal>
    </div>
  );
};

export default Home;
