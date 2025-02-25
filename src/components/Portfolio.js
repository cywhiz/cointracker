import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Portfolio({ portfolio, removeCoin, clearPortfolio }) {
  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <CardContent sx={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: "#1a237e",
              margin: 0,
            }}
          >
            Portfolio
          </h2>
          {portfolio.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={clearPortfolio}
              sx={{
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#ffebee" },
              }}
            >
              Clear Portfolio
            </Button>
          )}
        </div>
        {portfolio.length === 0 ? (
          <p>No coins in portfolio yet.</p>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <Table
              size="small"
              sx={{
                "& td, & th": {
                  py: 1.5,
                  px: 2,
                  fontFamily: "'Poppins', sans-serif",
                },
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e8eaf6" }}>
                  <TableCell>Coin</TableCell>
                  <TableCell># of Coins</TableCell>
                  <TableCell>Avg Cost</TableCell>
                  <TableCell
                    sx={{ backgroundColor: "#e0f7fa", fontWeight: 600 }}
                  >
                    Current Price
                  </TableCell>
                  <TableCell>Gains/Loss</TableCell>
                  <TableCell>Total Value</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {portfolio.map((item, index) => {
                  const gainsValue = item.totalValue - item.totalCost;
                  const gainsPercent =
                    item.avgCost > 0 ? (gainsValue / item.totalCost) * 100 : 0;
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                        "&:hover": { backgroundColor: "#f0f0f0" },
                      }}
                    >
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          "&:hover": { color: "#1976d2" },
                        }}
                        onClick={() =>
                          window.open(
                            `https://www.coingecko.com/en/coins/${item.coin}`,
                            "_blank"
                          )
                        }
                      >
                        <img
                          src={item.image}
                          alt={item.coinName}
                          width="20"
                          height="20"
                          style={{ marginRight: 8 }}
                        />
                        {item.coinName} ({item.coinSymbol})
                      </TableCell>
                      <TableCell>{item.totalAmount.toFixed(6)}</TableCell>
                      <TableCell>${item.avgCost.toFixed(2)}</TableCell>
                      <TableCell sx={{ backgroundColor: "#e0f7fa" }}>
                        ${item.currentPrice.toFixed(2)}
                      </TableCell>
                      <TableCell
                        sx={{ color: gainsValue >= 0 ? "green" : "red" }}
                      >
                        {gainsValue >= 0 ? "+" : ""}${gainsValue.toFixed(2)} (
                        {gainsPercent.toFixed(2)}%)
                      </TableCell>
                      <TableCell>${item.totalValue.toFixed(2)}</TableCell>
                      <TableCell>
                        <Link to={`/portfolio/${item.coinSymbol}`}>
                          Details
                        </Link>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => removeCoin(item.coin)}
                          sx={{ "&:hover": { backgroundColor: "#ffebee" } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
