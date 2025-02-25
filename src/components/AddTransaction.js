import { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Autocomplete,
  Snackbar,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { useCoins } from "../context/CoinContext";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AddTransaction({ addTransaction }) {
  const { coinData, loading, coins } = useCoins();
  const [transactions, setTransactions] = useState([
    { coin: null, amount: "", price: "", type: "buy" },
  ]);
  const [message, setMessage] = useState("");

  const handleAddTransactionField = () => {
    setTransactions([
      ...transactions,
      { coin: null, amount: "", price: "", type: "buy" },
    ]);
  };

  const handleRemoveTransactionField = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const handleTransactionChange = (index, field, value) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[index][field] = value;
    setTransactions(updatedTransactions);
  };

  const handleSubmitTransactions = () => {
    const validTransactions = transactions.filter(
      (t) => t.coin && t.amount && t.price
    );
    if (validTransactions.length === 0) return;

    const batchedTransactions = validTransactions.map((t) => ({
      coin: t.coin.id,
      coinName: t.coin.name,
      coinSymbol: t.coin.symbol.toUpperCase(),
      amount: parseFloat(t.amount) * (t.type === "sell" ? -1 : 1),
      price: parseFloat(t.price),
    }));

    addTransaction(batchedTransactions);

    setMessage(
      `Added ${validTransactions.length} transaction(s) successfully!`
    );
    setTransactions([{ coin: null, amount: "", price: "", type: "buy" }]);
  };

  if (loading) return <p>Loading coin data...</p>;

  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <CardContent sx={{ padding: "20px" }}>
        <h2
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: "#1a237e",
            marginBottom: "20px",
          }}
        >
          Add Transactions
        </h2>
        {transactions.map((t, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 2,
              mb: 1.5,
              alignItems: "center",
              flexWrap: "wrap",
              backgroundColor: "#fafafa",
              padding: "10px",
              borderRadius: "8px",
              minWidth: 0,
              flexDirection: { xs: "column", sm: "row" }, // Stack on small screens, row on larger
              "& > *": { flexShrink: 0 }, // Prevent shrinking of children
            }}
          >
            <Autocomplete
              options={coins}
              getOptionLabel={(option) =>
                `${option.symbol.toUpperCase()} - ${option.name}`
              }
              value={t.coin}
              onChange={(e, newValue) =>
                handleTransactionChange(index, "coin", newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Coin"
                  sx={{
                    minWidth: 240, // Minimum width to ensure it doesn’t shrink too much
                    width: { xs: "100%", sm: 240 },
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
              )}
              sx={{ width: { xs: "100%", sm: 240 } }}
            />
            <TextField
              label="Amount"
              type="number"
              value={t.amount}
              onChange={(e) =>
                handleTransactionChange(index, "amount", e.target.value)
              }
              sx={{
                minWidth: 120,
                width: { xs: "100%", sm: 120 },
                "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              }}
            />
            <TextField
              label="Price"
              type="number"
              value={t.price}
              onChange={(e) =>
                handleTransactionChange(index, "price", e.target.value)
              }
              sx={{
                minWidth: 120,
                width: { xs: "100%", sm: 120 },
                "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                minWidth: 100,
                width: { xs: "100%", sm: 100 },
                color: "#424242",
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Current: $
              {(t.coin && coinData[t.coin.id]?.current_price?.toFixed(2)) ||
                "N/A"}
            </Typography>
            <Button
              variant={t.type === "buy" ? "contained" : "outlined"}
              color="success"
              onClick={() => handleTransactionChange(index, "type", "buy")}
              sx={{
                py: 0.5,
                minWidth: 60,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#2e7d32" },
              }}
            >
              Buy
            </Button>
            <Button
              variant={t.type === "sell" ? "contained" : "outlined"}
              color="error"
              onClick={() => handleTransactionChange(index, "type", "sell")}
              sx={{
                py: 0.5,
                minWidth: 60,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#c62828" },
              }}
            >
              Sell
            </Button>
            {transactions.length > 1 && (
              <IconButton
                color="error"
                onClick={() => handleRemoveTransactionField(index)}
                size="small"
                sx={{ "&:hover": { backgroundColor: "#ffebee" } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
        <Box sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddTransactionField}
            sx={{
              mr: 1,
              borderRadius: "8px",
              color: "#1976d2",
              borderColor: "#1976d2",
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
          >
            Add Another
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitTransactions}
            sx={{
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Submit All
          </Button>
        </Box>
        <Snackbar
          open={!!message}
          autoHideDuration={3000}
          onClose={() => setMessage("")}
          message={message}
        />
      </CardContent>
    </Card>
  );
}
