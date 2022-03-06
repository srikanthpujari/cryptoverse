import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  LinearProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import CoinInfo from "../components/CoinInfo";
import parse from "html-react-parser";
import { CoinsState } from "../context/CoinsProvider";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

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
      flexDirection: "column",
      //justifyContent: "center",
      alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      justifyContent: "space-around",
    },
  },
  button: {
    color: "black",
    width: "100%",
    marginTop: 10,
    [theme.breakpoints.down("md")]: {
      width: "20%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

const Coins = () => {
  const [coin, setCoin] = useState();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const classes = useStyles();

  const { currency, symbol, user, watchlist, setAlert } = CoinsState();

  const coinInWatchList = watchlist.includes(coin?.id);

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
    // eslint-disable-next-line
  }, [id]);

  const handleAddToWatchlist = async () => {
    const coinref = doc(db, "watchlist", user.uid);

    try {
      await setDoc(coinref, {
        coins: watchlist ? [...watchlist, coin?.id] : [coin?.id],
      });

      setAlert({
        open: true,
        severity: "success",
        message: "Coin successfully added to watchlist",
      });
    } catch (error) {
      setAlert({
        open: true,
        severity: "error",
        message: error.message,
      });
    }
  };

  const handleRemoveFromWatchlist = async () => {
    const coinref = doc(db, "watchlist", user.uid);

    try {
      await setDoc(
        coinref,
        {
          coins: watchlist.filter((coin1) => coin1 !== coin?.id),
        },
        {
          merge: "true",
        }
      );

      setAlert({
        open: true,
        severity: "success",
        message: "Coin successfully removed from watchlist",
      });
    } catch (error) {
      setAlert({
        open: true,
        severity: "error",
        message: error.message,
      });
    }
  };

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
              {user ? (
                <Button
                  size="large"
                  className={classes.button}
                  onClick={
                    coinInWatchList
                      ? handleRemoveFromWatchlist
                      : handleAddToWatchlist
                  }
                  style={{ backgroundColor: coinInWatchList ? "red" : "gold" }}
                >
                  {coinInWatchList
                    ? "Remove From WatchList"
                    : "Add To Watchlist"}
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
          <CoinInfo coin={coin} />
        </div>
      )}
    </>
  );
};

export default Coins;
