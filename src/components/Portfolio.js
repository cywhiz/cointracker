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
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Portfolio({ portfolio, removeCoin, clearPortfolio }) {
  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        mt: { xs: 2, md: 0 },
      }}
    >
      <CardContent sx={{ padding: { xs: "16px", md: "20px" } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: "#1a237e",
              margin: 0,
              fontSize: { xs: "1.5rem", sm: "2rem" },
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
                mt: { xs: 1, sm: 0 },
                fontSize: { xs: "0.8rem", sm: "1rem" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Clear Portfolio
            </Button>
          )}
        </Box>
        {portfolio.length === 0 ? (
          <p>No coins in portfolio yet.</p>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              overflowX: { xs: "auto", sm: "hidden" },
            }}
          >
            <Table
              size="small"
              sx={{
                "& td, & th": {
                  py: { xs: 1, sm: 1.5 },
                  px: { xs: 1, sm: 2 },
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={item.image}
                            alt={item.coinName}
                            style={{ width: "20px", height: "20px" }}
                          />
                          <Box component="span" sx={{ ml: { xs: 1, sm: 1.5 } }}>
                            {item.coinName} ({item.coinSymbol})
                          </Box>
                        </Box>
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
