import { useParams } from "react-router-dom";
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
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function PortfolioDetails({ transactions, removeTransaction }) {
  const { coinSymbol } = useParams();
  const coinTransactions = transactions.filter(
    (tx) => tx.coinSymbol === coinSymbol.toUpperCase()
  );

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
          {coinSymbol} Transactions
        </h2>
        {coinTransactions.length === 0 ? (
          <p>No transactions found for {coinSymbol}.</p>
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
                  <TableCell>Amount</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coinTransactions.map((tx, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    <TableCell>{tx.amount.toFixed(6)}</TableCell>
                    <TableCell>${tx.price.toFixed(2)}</TableCell>
                    <TableCell>${(tx.amount * tx.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => removeTransaction(index)}
                        sx={{ "&:hover": { backgroundColor: "#ffebee" } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
