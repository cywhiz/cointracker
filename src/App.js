import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { CoinProvider, useCoins } from "./context/CoinContext";
import AddTransaction from "./components/AddTransaction";
import Portfolio from "./components/Portfolio";
import PortfolioDetails from "./components/PortfolioDetails";
import TopGainersLosers from "./components/TopGainersLosers";
import {
  Container,
  AppBar,
  Toolbar,
  Button,
  CssBaseline,
  Box,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
import "@fontsource/poppins/400.css"; // Regular
import "@fontsource/poppins/500.css"; // Medium
import "@fontsource/poppins/600.css"; // Semi-bold (fixing the error)
import "@fontsource/poppins/700.css"; // Bold

// Firebase config (replace with your own from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDSAkmS6X9KF9gfMQroBOT-O3RoK0ZKB18",
  authDomain: "cointracker-41dd6.firebaseapp.com",
  databaseURL:
    "https://cointracker-41dd6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cointracker-41dd6",
  storageBucket: "cointracker-41dd6.firebasestorage.app",
  messagingSenderId: "683782715526",
  appId: "1:683782715526:web:44c9b3e06f32cec910b907",
  measurementId: "G-WYZXZCRF9Y",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h2: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 500 },
    body2: { fontWeight: 500 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#ff5722" },
    error: { main: "#d32f2f" },
    success: { main: "#388e3c" },
  },
});

function MainContent() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const { coinData } = useCoins();

  useEffect(() => {
    if (user) {
      const transactionsRef = ref(db, `portfolios/${user.uid}/transactions`);
      onValue(transactionsRef, (snapshot) => {
        const data = snapshot.val();
        setTransactions(data || []);
      });
    } else {
      setTransactions([]);
    }
  }, [user]);

  const addTransaction = async (newTransactions) => {
    const transactionsToAdd = Array.isArray(newTransactions)
      ? newTransactions
      : [newTransactions];
    const updatedTransactions = [...transactions, ...transactionsToAdd];
    setTransactions(updatedTransactions);
    if (user) {
      await set(
        ref(db, `portfolios/${user.uid}/transactions`),
        updatedTransactions
      );
    }
  };

  const removeTransaction = async (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
    if (user) {
      await set(
        ref(db, `portfolios/${user.uid}/transactions`),
        updatedTransactions
      );
    }
  };

  const removeCoin = async (coinId) => {
    const updatedTransactions = transactions.filter((tx) => tx.coin !== coinId);
    setTransactions(updatedTransactions);
    if (user) {
      await set(
        ref(db, `portfolios/${user.uid}/transactions`),
        updatedTransactions
      );
    }
  };

  const clearPortfolio = async () => {
    setTransactions([]);
    if (user) {
      await set(ref(db, `portfolios/${user.uid}/transactions`), []);
    }
  };

  const portfolio = coinData
    ? Object.values(
        transactions.reduce((acc, tx) => {
          const coinId = tx.coin;
          if (!acc[coinId]) {
            acc[coinId] = {
              coin: coinId,
              coinName: tx.coinName,
              coinSymbol: tx.coinSymbol,
              image:
                coinData[coinId]?.image || "https://via.placeholder.com/20",
              totalAmount: 0,
              totalCost: 0,
            };
          }
          acc[coinId].totalAmount += tx.amount;
          acc[coinId].totalCost += tx.amount * tx.price;
          acc[coinId].avgCost =
            acc[coinId].totalAmount !== 0
              ? acc[coinId].totalCost / acc[coinId].totalAmount
              : 0;
          acc[coinId].currentPrice = coinData[coinId]?.current_price || 0;
          acc[coinId].totalValue =
            acc[coinId].totalAmount * acc[coinId].currentPrice;
          return acc;
        }, {})
      )
    : [];

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Router>
      <Container
        sx={{
          backgroundColor: "#f4f6f8",
          minHeight: "100vh",
          padding: { xs: "16px", md: "40px" },
          maxWidth: { xs: "100%", md: "lg" },
        }}
      >
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#1a237e",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <Toolbar
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "center" },
              py: { xs: 1 },
            }}
          >
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                color: "#fff",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                mb: { xs: 1, sm: 0 },
              }}
            >
              CoinTracker
            </span>
            <Box sx={{ flexGrow: 1 }} />{" "}
            {/* Spacer to push buttons to the right */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 1,
              }}
            >
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{
                  color: "#fff",
                  "&:hover": { backgroundColor: "#3f51b5" },
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/add"
                sx={{
                  color: "#fff",
                  "&:hover": { backgroundColor: "#3f51b5" },
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                }}
              >
                Add Transaction
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/portfolio"
                sx={{
                  color: "#fff",
                  "&:hover": { backgroundColor: "#3f51b5" },
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                }}
              >
                Portfolio
              </Button>
              {user ? (
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: "#ff5722",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#e64a19" },
                    borderRadius: "20px",
                    padding: { xs: "4px 12px", sm: "6px 16px" },
                    fontWeight: "bold",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "0.8rem", sm: "1rem" },
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleLogin}
                  sx={{
                    backgroundColor: "#ff5722",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#e64a19" },
                    borderRadius: "20px",
                    padding: { xs: "4px 12px", sm: "6px 16px" },
                    fontWeight: "bold",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: { xs: "0.8rem", sm: "1rem" },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<TopGainersLosers />} />
          <Route
            path="/add"
            element={<AddTransaction addTransaction={addTransaction} />}
          />
          <Route
            path="/portfolio"
            element={
              <Portfolio
                portfolio={portfolio}
                removeCoin={removeCoin}
                clearPortfolio={clearPortfolio}
              />
            }
          />
          <Route
            path="/portfolio/:coinSymbol"
            element={
              <PortfolioDetails
                transactions={transactions}
                removeTransaction={removeTransaction}
              />
            }
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CoinProvider>
        <MainContent />
      </CoinProvider>
    </ThemeProvider>
  );
}
