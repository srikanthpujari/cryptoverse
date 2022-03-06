import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";

const CoinsContext = createContext();

const CoinsProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("");
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const fetchCoins = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      );

      setCoins(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
  }, []);

  useEffect(() => {
    if (user) {
      const coinref = doc(db, "watchlist", user.uid);

      var unsubscribe = onSnapshot(coinref, (coin) => {
        if (coin.exists) {
          console.log(coin.data());
          setWatchlist(coin.data().coins);
        } else {
          console.log("No Items in watchlist");
        }
      });

      return () => unsubscribe();
    }
  }, user);

  useEffect(() => {
    switch (currency) {
      case "AUD":
        setSymbol("a$");
        break;
      case "CAD":
        setSymbol("c$");
        break;
      case "EUR":
        setSymbol("€");
        break;
      case "GBP":
        setSymbol("£");
        break;
      case "INR":
        setSymbol("₹");
        break;
      case "USD":
        setSymbol("$");
        break;

      default:
        return;
    }
  }, [currency]);

  return (
    <CoinsContext.Provider
      value={{
        symbol,
        currency,
        setCurrency,
        alert,
        setAlert,
        user,
        watchlist,
        setWatchlist,
        coins,
        loading,
        fetchCoins,
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
};

export const CoinsState = () => {
  return useContext(CoinsContext);
};
export default CoinsProvider;
