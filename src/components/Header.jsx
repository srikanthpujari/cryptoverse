import {
  AppBar,
  createTheme,
  makeStyles,
  MenuItem,
  Select,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { CoinsState } from "../context/CoinsProvider";

const useStyles = makeStyles({
  title: {
    color: "gold",
    cursor: "pointer",
    flex: "1",
  },
  dropdown: {
    marginRight: "15px",
    width: "80px",
    height: "40px",
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

const AVAILABLECURRENCY = ["AUD", "CAD", "EUR", "GBP", "INR", "USD"];

const Header = () => {
  const classes = useStyles();
  const { currency, setCurrency } = CoinsState();
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Typography
            className={classes.title}
            onClick={() => navigate("/")}
            style={{ fontWeight: "700" }}
            variant="h6"
          >
            CryptoVerse
          </Typography>

          <Select
            label="Currency"
            variant="filled"
            className={classes.dropdown}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {AVAILABLECURRENCY.map((curr) => (
              <MenuItem key={curr} value={curr}>
                {curr}
              </MenuItem>
            ))}
          </Select>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
