import {
  CircularProgress,
  createTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { CoinsState } from "../context/CoinsProvider";
import { chartDays } from "../config/data";
import Button from "./Button";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
}));

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

const CoinInfo = ({ coin }) => {
  const classes = useStyles();

  const [historicData, setHistoricData] = useState([]);
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);

  const { currency } = CoinsState();

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=${currency}&days=${days}`
      );

      setLoading(false);
      setHistoricData(data.prices);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [currency, days]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {loading ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={200}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: historicData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
                marginTop: 20,
              }}
            >
              {chartDays.map((item) => (
                <Button
                  key={item.value}
                  onClick={() => setDays(item.value)}
                  selected={item.value === days}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
