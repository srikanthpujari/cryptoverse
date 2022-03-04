import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LinearProgress, makeStyles, Typography } from "@material-ui/core";
import CoinInfo from "../components/CoinInfo";
import parse from "html-react-parser";
import { CoinsState } from "../context/CoinsProvider";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRight: "2px solid gray",
    marginTop: 20,
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  description: {
    textAlign: "justify",
    /* [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "center",
      // textAlign: "center",
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "center",
      /* textAlign: "justify",
      wordBreak: "break-all", */
    // },
  },
  marketData: {
    alignSelf: "start",
    padding: 20,
    paddingTop: 10,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "space-around",
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-around",
    },
  },
}));

const Coins = () => {
  const [coin, setCoin] = useState();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const classes = useStyles();

  const { currency, symbol } = CoinsState();

  const fetchCoin = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}`
      );

      console.log(data);
      setCoin(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCoin();
  }, [id]);

  return (
    <>
      {loading || !coin ? (
        <LinearProgress style={{ backgroundColor: "gold" }} />
      ) : (
        <div className={classes.container}>
          <div className={classes.sidebar}>
            <img src={coin?.image.large} alt={coin.name} />
            <Typography variant="h4" style={{ margin: 10, fontWeight: "bold" }}>
              {coin.name}
            </Typography>
            <Typography
              variant="subtitle2"
              className={classes.description}
              style={{
                width: "100%",
                padding: 20,
                paddingTop: 10,
              }}
            >
              {parse(coin.description.en.split(". ")[0])}
              {"."}
            </Typography>
            <div className={classes.marketData}>
              <span style={{ display: "flex" }}>
                <Typography variant="h5">RANK:</Typography>
                &nbsp;&nbsp;
                <Typography variant="h5">{coin.market_cap_rank}</Typography>
              </span>
              <span style={{ display: "flex" }}>
                <Typography variant="h5">Current Price:</Typography>
                &nbsp;&nbsp;
                <Typography variant="h5">
                  {symbol}{" "}
                  {coin.market_data.current_price[currency.toLowerCase()]}
                </Typography>
              </span>
              <span style={{ display: "flex" }}>
                <Typography variant="h5">Market Cap:</Typography>
                &nbsp;&nbsp;
                <Typography variant="h5">
                  {symbol}{" "}
                  {coin.market_data.market_cap[currency.toLowerCase()]
                    .toString()
                    .slice(0, -6)}
                  M
                </Typography>
              </span>
            </div>
          </div>
          <CoinInfo coin={coin} />
        </div>
      )}
    </>
  );
};

export default Coins;
