import { makeStyles } from "@material-ui/core";
import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import { CoinsState } from "../context/CoinsProvider";

const useStyles = makeStyles({
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    textTransform: "capitalize",
    cursor: "pointer",
  },
});

const Carousel = () => {
  const [trending, setTrending] = useState([]);

  const classes = useStyles();

  const { currency, symbol } = CoinsState();

  const fetchTrendingCoins = async () => {
    try {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
      );

      setTrending(data);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchTrendingCoins();
    // eslint-disable-next-line
  }, [currency]);

  const items = trending.map((coin) => {
    return (
      <>
        <Link to={`/coins/${coin?.id}`} className={classes.carouselItem}>
          <img
            src={coin?.image}
            alt={coin?.name}
            height="80px"
            style={{ marginBottom: "10px" }}
          />
          <span>
            {coin?.symbol}
            &nbsp;&nbsp;
            <span
              style={{
                color:
                  coin?.price_change_percentage_24h > 0 ? "green" : "#ff3333",
                fontWeight: "bold",
              }}
            >
              {coin?.price_change_percentage_24h > 0
                ? "+" + coin?.price_change_percentage_24h?.toFixed(2)
                : coin?.price_change_percentage_24h?.toFixed(2)}
            </span>
          </span>
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>
            {symbol}
            &nbsp;
            {coin?.current_price}
          </span>
        </Link>
      </>
    );
  });

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        items={items}
        autoPlay
        autoPlayInterval={1000}
        animationDuration={1500}
        disableButtonsControls
        disableDotsControls
        infinite
        mouseTracking
        responsive={{
          0: {
            items: 2,
          },
          512: {
            items: 4,
          },
        }}
      />
    </div>
  );
};

export default Carousel;
