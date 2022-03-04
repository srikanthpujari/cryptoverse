import {
  Container,
  createTheme,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CoinsState } from "../context/CoinsProvider";

const useStyles = makeStyles({
  row: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#262626",
    },
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "gold",
    },
  },
});

const CoinsTable = () => {
  const classes = useStyles();

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { currency, symbol } = CoinsState();

  const navigate = useNavigate();

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
    fetchCoins();
  }, [currency]);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const handleSearch = () => {
    return coins.filter((coin) => {
      return (
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
      );
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container style={{ textAlign: "center" }}>
        <Typography variant="h4" style={{ margin: "10px" }}>
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          label="Search for your favorite cryptocurrency.."
          style={{ width: "100%", marginBottom: "10px" }}
          variant="outlined"
          onChange={(e) => setSearch(e.target.value)}
        />

        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ backgroundColor: "gold" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((cell) => (
                    <TableCell
                      key={cell}
                      style={{ color: "black", fontWeight: "700" }}
                      align={cell === "Coin" ? "" : "right"}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    return (
                      <TableRow
                        key={row.name}
                        onClick={() => navigate(`/coins/${row.id}`)}
                        className={classes.row}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ display: "flex", gap: 15 }}
                        >
                          <img
                            src={row?.image}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontWeight: "bold",
                                fontSize: 20,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "gray" }}>{row.name}</span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {symbol} &nbsp;
                          {row.current_price.toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color:
                              row?.price_change_24h >= 0 ? "green" : "#ff3333",
                            fontWeight: "bold",
                          }}
                        >
                          {row?.price_change_24h >= 0 ? "+" : ""}
                          {row?.price_change_24h.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {symbol} &nbsp;
                          {row.market_cap.toString().slice(0, -6)} M
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          count={(handleSearch()?.length / 10).toFixed(0)}
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            padding: 20,
          }}
          classes={{ ul: classes.pagination }}
          hidePrevButton
          hideNextButton
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
