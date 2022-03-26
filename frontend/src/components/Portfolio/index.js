import { useState, useEffect, Fragment } from "react";
import { Card, Container, Divider, Tooltip, Typography } from "@mui/material";
import { onSnapshot, collection, where, query, doc } from "firebase/firestore";
import { db } from "../Auth/firebase";

import { ArrowCircleUp, ArrowCircleDown } from "@mui/icons-material";

import { showPrice, roundTo } from "../../utils";

const coins = {
  BTC: 0,
  ETH: 1,
  DOGE: 2,
  SHIB: 3,
  SOL: 4,
  TRX: 5,
  XRP: 6,
};

const Portfolio = ({ user }) => {
  const [prices, setPrices] = useState(null);
  const [time, setTime] = useState(null);
  const [status, setStatus] = useState(null);

  const [transactions, setTransactions] = useState(null);

  useEffect(() => {
    const unsubscribeValues = onSnapshot(collection(db, "values"), (data) => {
      const vals = data.docs
        .map((el) => el.data())
        .sort((a, b) => {
          return a.time - b.time;
        })
        .map((el) => [el.time, el.val]);

      if (vals.length > 0) {
        setPrices(vals[vals.length - 1][1]);
        setTime(vals[vals.length - 1][0]);
      } else {
        setPrices(null);
        setTime(null);
      }
    });

    const unsubscribeEvents = onSnapshot(doc(db, "event", "start"), (data) => {
      setStatus(data.data());
    });

    const q = query(
      collection(db, "transactions"),
      where("user", "==", user.id)
    );

    const unsubscribeTransactions = onSnapshot(q, (querySnapshot) => {
      const hist = [];
      querySnapshot.forEach((doc) => {
        hist.push(doc.data());
      });

      setTransactions(hist.sort((a, b) => b.time - a.time));
    });

    return () => {
      unsubscribeValues();
      unsubscribeEvents();
      unsubscribeTransactions();
    };
  }, []);

  useEffect(() => {
    console.log({ transactions });
  }, [transactions]);

  const invested = transactions?.reduce(
    (prev, cur) => prev - cur.coins * cur.type * prices?.[coins[cur.curr]],
    0
  );

  return (
    <Container style={{ marginTop: "20px", textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            padding: "10px 20px",
            margin: "0px 10px",
            boxShadow: "0px 0px 15px 5px rgb(200,200,200,0.3)",
          }}
        >
          <div>
            <Typography style={{ fontSize: "14px", color: "rgb(160,160,160)" }}>
              TOTAL PORTFOLIO
            </Typography>
          </div>
          <div>{showPrice(invested)}</div>
        </Card>
        <Card
          style={{
            padding: "10px 20px",
            margin: "0px 10px",
            boxShadow: "0px 0px 15px 5px rgb(200,200,200,0.3)",
          }}
        >
          <Typography>CURRENT STATUS</Typography>
          <Divider />
          <div>
            <Typography
              style={{
                fontSize: "18px",
                color: status?.stop
                  ? "rgb(235,0,0)"
                  : status?.started
                  ? "rgb(31, 147, 88)"
                  : "rgb(140,140,140)",
              }}
            >
              {status?.stop
                ? "STOPPED"
                : status?.started
                ? "RUNNING"
                : "NOT STARTED"}
            </Typography>
          </div>
          <div style={{ fontWeight: 600 }}>
            {status?.started && `Day ${parseInt(time / 10)} Hour ${time % 10}`}
          </div>
        </Card>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Card
          style={{
            flexDirection: "column",
            maxHeight: "400px",

            padding: "10px",
          }}
        >
          <Typography variant="h5">TRADE HISTORY</Typography>
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
                  {transactions?.length - 1 !== index && (
                    <Divider
                      style={{
                        height: "0.4px",
                        width: "calc(100% - 20px)",
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
            {transactions?.length === 0 && (
              <div style={{ padding: "20px 0px" }}>
                <Typography>Nothing to show</Typography>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default Portfolio;
