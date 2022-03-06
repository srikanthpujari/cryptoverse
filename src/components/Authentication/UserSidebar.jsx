import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import { Avatar, Box } from "@material-ui/core";
import { CoinsState } from "../../context/CoinsProvider";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import DeleteIcon from "@material-ui/icons/Delete";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    height: "100%",
    width: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    alignItems: "center",
  },
  picture: {
    height: 200,
    width: 200,
    backgroundColor: "gold",
    objectFit: "contain",
  },
  tag: {
    fontWeight: "bold",
    fontSize: "25px",
  },
  button: {
    backgroundColor: "gold",
    color: "black",
    width: "96%",
    fontWeight: "bold",
  },
  watchlist: {
    display: "flex",
    flex: 1,
    backgroundColor: "grey",
    width: "96%",
    margin: 10,
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "gold",
  },
  list: {
    display: "flex",
    //flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    color: "white",
    width: "96%",
    padding: 10,
    margin: 5,
    backgroundColor: "gold",
    color: "black",
    borderRadius: 5,
    boxShadow: "0 0 3px black",
    fontSize: 15,
    fontWeight: "lighter",
  },
});

export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const { user, setAlert, coins, watchlist, symbol } = CoinsState();

  const navigate = useNavigate();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleLogout = () => {
    signOut(auth);
    setAlert({
      open: true,
      severity: "success",
      message: "Logged out successfully",
    });
    //toggleDrawer();
  };

  const handleRemoveFromWatchlist = async (coin) => {
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
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              marginLeft: 5,
              backgroundColor: "gold !important",
              cursor: "pointer",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />
                <span className={classes.tag}>
                  {user.displayName || user.email}
                </span>
              </div>
              <div className={classes.watchlist} style={{ fontSize: 15 }}>
                <span style={{ marginBottom: 10 }}>watch list</span>
                {coins.map((coin) => {
                  if (watchlist.includes(coin.id)) {
                    return (
                      <div className={classes.list}>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            navigate(`/coins/${coin.id}`);
                          }}
                        >
                          {coin.name}
                        </span>
                        <span style={{ display: "flex", alignItems: "center" }}>
                          {symbol}
                          {coin.current_price.toFixed(2)}
                          <DeleteIcon
                            onClick={() => handleRemoveFromWatchlist(coin)}
                            style={{
                              height: 18,
                              marginLeft: 5,
                              color: "black",
                              cursor: "pointer",
                            }}
                          />
                        </span>
                      </div>
                    );
                  }
                })}
              </div>
              <Button
                variant="contained"
                className={classes.button}
                size="large"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
