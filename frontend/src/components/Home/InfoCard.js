import {
  Avatar,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import { showPrice } from "../../utils";

const InfoCard = ({ data }) => {
  return (
    <Card
      sx={{
        maxWidth: 400,
        boxShadow: "0px 0px 15px 5px rgb(200,200,200,0.7)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 20px 10px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={data.img} alt="btc" />
          <Typography variant="h6" style={{ paddingLeft: "10px" }}>
            {data.name}
          </Typography>
        </div>
        <div>
          <Typography>
            {data.owned} {data.curr}
          </Typography>
        </div>
      </div>

      <Divider />

      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={{ border: 0, padding: "10px 16px" }}>
                <div>
                  <Typography
                    style={{ fontSize: "14px", color: "rgb(160,160,160)" }}
                  >
                    CURRENT
                  </Typography>
                </div>
                <div>
                  <Typography>
                    {showPrice(data.current * data.owned)}
                  </Typography>
                </div>
              </TableCell>
              <TableCell style={{ border: 0, padding: "10px 16px" }}>
                <div>
                  <Typography
                    style={{ fontSize: "14px", color: "rgb(160,160,160)" }}
                  >
                    INVESTED
                  </Typography>
                </div>
                <div>
                  <Typography>{showPrice(data.invested)}</Typography>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ border: 0, padding: "10px 16px" }}>
                <div>
                  <Typography
                    style={{ fontSize: "14px", color: "rgb(160,160,160)" }}
                  >
                    RETURNS
                  </Typography>
                </div>
                <div>
                  <Typography style={{ color: "rgb(233,0,0)" }}>
                    -₹1,819.91
                  </Typography>
                </div>
              </TableCell>
              <TableCell style={{ border: 0, padding: "10px 16px" }}>
                <div>
                  <Typography
                    style={{ fontSize: "14px", color: "rgb(160,160,160)" }}
                  >
                    RETURNS %
                  </Typography>
                </div>
                <div>
                  <Typography style={{ color: "rgb(233,0,0)" }}>
                    -36.39%
                  </Typography>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ border: 0, padding: "10px 16px" }}>
                <div>
                  <Typography
                    style={{ fontSize: "14px", color: "rgb(160,160,160)" }}
                  >
                    AVERAGE BUYING PRICE
                  </Typography>
                </div>
                <div>
                  <Typography>₹296.81</Typography>
                </div>
              </TableCell>
              <TableCell style={{ border: 0, padding: "10px 16px" }}>
                <div>
                  <Typography
                    style={{ fontSize: "14px", color: "rgb(160,160,160)" }}
                  >
                    CURRENT BUYING PRICE
                  </Typography>
                </div>
                <div>
                  <Typography>{showPrice(data.current)}</Typography>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
