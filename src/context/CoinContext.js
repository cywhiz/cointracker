import { createContext, useState, useEffect, useContext } from "react";

const CoinContext = createContext();

export function CoinProvider({ children }) {
  const [coins, setCoins] = useState([]);
  const [coinData, setCoinData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1000&page=1&sparkline=false"
        );
        const data = await response.json();
        setCoins(data);
        const coinMap = data.reduce(
          (acc, coin) => ({ ...acc, [coin.id]: coin }),
          {}
        );
        setCoinData(coinMap);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  return (
    <CoinContext.Provider value={{ coins, coinData, loading }}>
      {children}
    </CoinContext.Provider>
  );
}

export function useCoins() {
  const context = useContext(CoinContext);
  if (context === undefined) {
    throw new Error("useCoins must be used within a CoinProvider");
  }
  return context;
}
