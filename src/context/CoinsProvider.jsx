import React, { createContext, useContext, useEffect, useState } from "react";

const CoinsContext = createContext();

const CoinsProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");

  const [symbol, setSymbol] = useState("");

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
    <CoinsContext.Provider value={{ symbol, currency, setCurrency }}>
      {children}
    </CoinsContext.Provider>
  );
};

export const CoinsState = () => {
  return useContext(CoinsContext);
};
export default CoinsProvider;
