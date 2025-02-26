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
  Switch,
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
        mt: { xs: 2, md: 0 },
      }}
    >
      <CardContent sx={{ padding: { xs: "16px", md: "20px" } }}>
        <h2
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: "#1a237e",
            marginBottom: "20px",
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          Add Transactions
        </h2>
        {transactions.map((t, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1, sm: 1 },
              mb: { xs: 1.5, sm: 1 },
              alignItems: { xs: "stretch", sm: "center" },
              backgroundColor: "#fafafa",
              padding: { xs: "6px", sm: "8px" },
              borderRadius: "8px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                order: { sm: -1 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  color: t.type === "buy" ? "#388e3c" : "#d32f2f",
                }}
              >
                {t.type === "buy" ? "Buy" : "Sell"}
              </Typography>
              <Switch
                checked={t.type === "buy"}
                onChange={(e) =>
                  handleTransactionChange(
                    index,
                    "type",
                    e.target.checked ? "buy" : "sell"
                  )
                }
                sx={{
                  "& .MuiSwitch-switchBase": {
                    color: "#d32f2f",
                    "&.Mui-checked": {
                      color: "#388e3c",
                    },
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: "#d32f2f",
                    opacity: 0.5,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#388e3c",
                    opacity: 0.5,
                  },
                }}
              />
            </Box>
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
                  size="small" // Added
                  sx={{
                    width: { xs: "100%", sm: 200 },
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
              )}
              sx={{ width: { xs: "100%", sm: 200 } }}
            />
            <TextField
              label="Amount"
              type="number"
              value={t.amount}
              onChange={(e) =>
                handleTransactionChange(index, "amount", e.target.value)
              }
              size="small" // Added
              sx={{
                width: { xs: "100%", sm: 80 },
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
              size="small" // Added
              sx={{
                width: { xs: "100%", sm: 80 },
                "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                width: { xs: "100%", sm: 80 },
                color: "#424242",
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
              }}
            >
              Current: $
              {(t.coin && coinData[t.coin.id]?.current_price?.toFixed(2)) ||
                "N/A"}
            </Typography>
            {transactions.length > 1 && (
              <IconButton
                color="error"
                onClick={() => handleRemoveTransactionField(index)}
                size="small"
                sx={{
                  "&:hover": { backgroundColor: "#ffebee" },
                  ml: { sm: "auto" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
        <Box
          sx={{
            mt: 1,
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddTransactionField}
            sx={{
              mr: { sm: 1 },
              borderRadius: "8px",
              color: "#1976d2",
              borderColor: "#1976d2",
              "&:hover": { backgroundColor: "#e3f2fd" },
              fontSize: { xs: "0.8rem", sm: "1rem" },
              width: { xs: "100%", sm: "auto" },
              py: "4px",
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
              fontSize: { xs: "0.8rem", sm: "1rem" },
              width: { xs: "100%", sm: "auto" },
              py: "4px",
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
          sx={{ width: { xs: "90%", sm: "auto" } }}
        />
      </CardContent>
    </Card>
  );
}
