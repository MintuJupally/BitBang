import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import {
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

import { db } from "../Auth/firebase";

let userTransactions = {};

const Admin = () => {
  const [users, setUsers] = useState(null);
  const [transactions, setTransactions] = useState(null);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (data) => {
      const list = [];
      data.docs.forEach((doc) => {
        list.push(doc.data());
      });

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

    return () => {
      unsubscribeUsers();
      unsubscribeTransactions();
    };
  }, []);

  useEffect(() => {
    // map user transaction money with user id
    transactions.forEach((trans) => {
      if (!userTransactions[trans.user]) {
        userTransactions[trans.user] = 0;
      }

      userTransactions[trans.user] += trans.amount;
    });
  }, [transactions]);

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
            </TableRow>
            {users?.map((part, index) => {
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
