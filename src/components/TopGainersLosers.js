import { useCoins } from "../context/CoinContext";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Grid,
  TableSortLabel,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function TopGainersLosers() {
  const { coins, loading } = useCoins();
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc");
  const [fearGreedIndex, setFearGreedIndex] = useState(null);

  useEffect(() => {
    const fetchFearGreed = async () => {
      try {
        const response = await fetch("https://api.alternative.me/fng/?limit=1");
        const data = await response.json();
        setFearGreedIndex(data.data[0]);
      } catch (error) {
        console.error("Error fetching Fear & Greed Index:", error);
      }
    };
    fetchFearGreed();
  }, []);

  if (loading) return <p>Loading cryptocurrency data...</p>;

  const stablecoinIds = [
    "tether",
    "usd-coin",
    "binance-usd",
    "dai",
    "true-usd",
    "usdd",
    "paxos-standard",
    "gemini-dollar",
    "frax",
    "stasis-eurs",
  ];
  const filteredCoins = coins.filter(
    (coin) => !stablecoinIds.includes(coin.id)
  );

  const sortedCoins = [...filteredCoins].sort((a, b) => {
    if (!sortField)
      return (
        (b.price_change_percentage_24h || 0) -
        (a.price_change_percentage_24h || 0)
      );
    const aValue =
      sortField === "name"
        ? a.name
        : sortField === "current_price"
        ? a.current_price
        : a.price_change_percentage_24h || 0;
    const bValue =
      sortField === "name"
        ? b.name
        : sortField === "current_price"
        ? b.current_price
        : b.price_change_percentage_24h || 0;
    return sortDirection === "asc"
      ? aValue > bValue
        ? 1
        : -1
      : bValue > aValue
      ? 1
      : -1;
  });

  const topGainers = sortedCoins.slice(0, 20);
  const topLosers = sortedCoins
    .filter((c) => c.price_change_percentage_24h < 0)
    .slice(-20)
    .reverse();

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortField(field);
    setSortDirection(isAsc ? "desc" : "asc");
  };

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
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: "#1a237e",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            Crypto Market Movers
          </Typography>
          {fearGreedIndex && (
            <Typography
              variant="body1"
              sx={{
                color: "#424242",
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                mt: { xs: 1, sm: 0 },
              }}
            >
              Fear & Greed Index: {fearGreedIndex.value} (
              {fearGreedIndex.value_classification})
            </Typography>
          )}
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#388e3c",
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Top Gainers (24h)
            </Typography>
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
                    <TableCell>
                      <TableSortLabel
                        active={sortField === "name"}
                        direction={sortField === "name" ? sortDirection : "asc"}
                        onClick={() => handleSort("name")}
                      >
                        Coin
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === "current_price"}
                        direction={
                          sortField === "current_price" ? sortDirection : "asc"
                        }
                        onClick={() => handleSort("current_price")}
                      >
                        Price
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === "price_change_percentage_24h"}
                        direction={
                          sortField === "price_change_percentage_24h"
                            ? sortDirection
                            : "asc"
                        }
                        onClick={() =>
                          handleSort("price_change_percentage_24h")
                        }
                      >
                        24h
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topGainers.map((coin) => (
                    <TableRow
                      key={coin.id}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                        "&:hover": {
                          backgroundColor: "#e0f7e9",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() =>
                        window.open(
                          `https://www.coingecko.com/en/coins/${coin.id}`,
                          "_blank"
                        )
                      }
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={coin.image}
                            alt={coin.name}
                            style={{ width: "20px", height: "20px" }}
                          />
                          <Box component="span" sx={{ ml: { xs: 1, sm: 1.5 } }}>
                            {coin.name} ({coin.symbol.toUpperCase()})
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>${coin.current_price.toFixed(2)}</TableCell>
                      <TableCell sx={{ color: "green" }}>
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#d32f2f",
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Top Losers (24h)
            </Typography>
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
                    <TableCell>
                      <TableSortLabel
                        active={sortField === "name"}
                        direction={sortField === "name" ? sortDirection : "asc"}
                        onClick={() => handleSort("name")}
                      >
                        Coin
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === "current_price"}
                        direction={
                          sortField === "current_price" ? sortDirection : "asc"
                        }
                        onClick={() => handleSort("current_price")}
                      >
                        Price
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === "price_change_percentage_24h"}
                        direction={
                          sortField === "price_change_percentage_24h"
                            ? sortDirection
                            : "asc"
                        }
                        onClick={() =>
                          handleSort("price_change_percentage_24h")
                        }
                      >
                        24h
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topLosers.map((coin) => (
                    <TableRow
                      key={coin.id}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                        "&:hover": {
                          backgroundColor: "#fce4e4",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() =>
                        window.open(
                          `https://www.coingecko.com/en/coins/${coin.id}`,
                          "_blank"
                        )
                      }
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={coin.image}
                            alt={coin.name}
                            style={{ width: "20px", height: "20px" }}
                          />
                          <Box component="span" sx={{ ml: { xs: 1, sm: 1.5 } }}>
                            {coin.name} ({coin.symbol.toUpperCase()})
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>${coin.current_price.toFixed(2)}</TableCell>
                      <TableCell sx={{ color: "red" }}>
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
