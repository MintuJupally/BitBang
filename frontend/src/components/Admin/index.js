import { useState, useEffect } from "react";
import axios from "axios";
import { collection, query, doc, where, onSnapshot } from "firebase/firestore";
import {
  Button,
  Card,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import {
  PlayCircleRounded,
  StopCircleRounded,
  RestartAltRounded,
} from "@mui/icons-material";

import { db } from "../Auth/firebase";
import { BACKEND_URL } from "../../constants";

const coins = {
  BTC: 0,
  ETH: 1,
  DOGE: 2,
  SHIB: 3,
  SOL: 4,
  TRX: 5,
  XRP: 6,
};

const Admin = ({ user }) => {
  const [users, setUsers] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [userTransactions, setUserTransactions] = useState(null);
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (data) => {
      const list = [];
      data.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      console.log({ list });

      setUsers(list);
    });

    const q = query(collection(db, "transactions"));

    const unsubscribeTransactions = onSnapshot(q, (querySnapshot) => {
      const hist = [];
      querySnapshot.forEach((doc) => {
        hist.push(doc.data());
      });

      setTransactions(hist);
    });

    const unsubscribeValues = onSnapshot(collection(db, "values"), (data) => {
      const vals = data.docs
        .map((el) => el.data())
        .sort((a, b) => {
          return a.time - b.time;
        })
        .map((el) => [el.time, el.val]);

      if (vals.length > 0) {
        setPrices(vals[vals.length - 1][1]);
      } else setPrices(null);
    });

    const unsubscribeEvents = onSnapshot(doc(db, "event", "start"), (data) => {
      setStatus(data.data());
    });

    return () => {
      unsubscribeUsers();
      unsubscribeTransactions();
      unsubscribeValues();
      unsubscribeEvents();
    };
  }, []);

  useEffect(() => {
    // map user transaction money with user id
    let userMap = {};
    if (prices && transactions) {
      transactions.forEach((trans) => {
        if (!userMap[trans.user]) {
          userMap[trans.user] = 0;
        }

        userMap[trans.user] +=
          trans.coins * trans.type * -1 * prices[coins[trans.curr]];
      });
    }

    setUserTransactions(userMap);
  }, [transactions, prices]);

  const perform = (type) => {
    if (["start", "stop", "refresh"].includes(type)) {
      setLoading(true);

      axios
        .post(BACKEND_URL + "api/admin/" + type, { token: user.token })
        .then((res) => {
          console.log(res);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.response.data);
          setLoading(false);
        });
    }
  };

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
            boxShadow: "0px 0px 15px 5px rgb(200,200,200,0.3)",
          }}
        >
          <div>
            <Typography style={{ fontSize: "14px", color: "rgb(160,160,160)" }}>
              PARTCIPANTS
            </Typography>
          </div>
          <div>
            {users ? (
              <Typography style={{ fontSize: "24px" }}>
                {users.length}
              </Typography>
            ) : (
              <CircularProgress />
            )}
          </div>
        </Card>
      </div>

      <div style={{ margin: "20px 0px" }}>
        <Button
          disabled={loading || (status?.started && !status?.paused)}
          variant="contained"
          style={{
            backgroundColor:
              loading || (status?.started && !status?.paused)
                ? "lightgrey"
                : "rgb(31, 147, 88)",
            margin: "0px 10px",
          }}
          onClick={() => {
            perform("start");
          }}
        >
          <PlayCircleRounded /> &nbsp;START
        </Button>
        <Button
          disabled={loading || status?.stop || status?.pause}
          variant="contained"
          style={{
            backgroundColor:
              loading || status?.stop || status?.pause
                ? "lightgrey"
                : "rgb(230, 0, 0)",
            margin: "0px 10px",
          }}
          onClick={() => {
            perform("stop");
          }}
        >
          <StopCircleRounded /> &nbsp;STOP
        </Button>
        <Button
          disabled={loading}
          variant="contained"
          style={{ margin: "0px 10px" }}
          onClick={() => {
            perform("refresh");
          }}
        >
          <RestartAltRounded /> &nbsp;REFRESH
        </Button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                style={{
                  border: 0,
                  padding: "3px",
                  width: "20px",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
                align="center"
              >
                Rank
              </TableCell>
              <TableCell
                style={{
                  border: 0,
                  padding: "3px",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
                align="left"
              >
                Email
              </TableCell>
              <TableCell
                style={{
                  border: 0,
                  padding: "3px",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
                align="center"
              >
                Wallet
              </TableCell>
              <TableCell
                style={{
                  border: 0,
                  padding: "3px",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
                align="center"
              >
                Portfolio
              </TableCell>
            </TableRow>
            {users
              ?.sort((a, b) => {
                return (
                  b.wallet +
                  (userTransactions[b.id] ?? 0) -
                  a.wallet -
                  (userTransactions[a.id] ?? 0)
                );
              })
              .map((part, index) => {
                return (
                  <TableRow
                    key={"user-" + index}
                    style={{
                      boxShadow: "0px 0px 15px 5px rgb(200,200,200,0.1)",
                      padding: "5px",
                    }}
                  >
                    <TableCell
                      style={{
                        border: 0,
                        padding: "3px",
                        width: "50px",
                        fontSize: "18px",
                      }}
                      align="center"
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      style={{ border: 0, padding: "3px", fontSize: "18px" }}
                      align="left"
                    >
                      {part.email}
                    </TableCell>
                    <TableCell
                      style={{ border: 0, padding: "3px", fontSize: "18px" }}
                      align="center"
                    >
                      {part.wallet}
                    </TableCell>
                    <TableCell
                      style={{ border: 0, padding: "3px", fontSize: "18px" }}
                      align="center"
                    >
                      {userTransactions[part.id] ?? 0}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
};

export default Admin;
