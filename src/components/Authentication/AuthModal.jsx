import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { AppBar, Box, Button, Tab, Tabs } from "@material-ui/core";
import Login from "./Login";
import Signup from "./Signup";
import GoogleButton from "react-google-button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { CoinsState } from "../../context/CoinsProvider";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    width: 400,
    color: "white",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "gold",
    color: "black",
    width: "80px",
    height: "40px",
    marginLeft: 10,
  },
  google: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 10,
    padding: 10,
    marginTop: 0,
  },
}));

export default function AuthModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const { setAlert } = CoinsState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const googleProvider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);

      setAlert({
        open: true,
        severity: "success",
        message: `Welcome to CryptoVerse, ${
          response.user.displayName || response.user.email
        }`,
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
      <Button
        variant="contained"
        className={classes.button}
        onClick={handleOpen}
      >
        Login
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <AppBar
              position="static"
              style={{ backgroundColor: "transparent", color: "white" }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                TabIndicatorProps={{ style: { backgroundColor: "gold" } }}
              >
                <Tab label="Login" />
                <Tab label="Signup" />
              </Tabs>
            </AppBar>
            {value === 0 ? (
              <Login handleClose={handleClose} />
            ) : (
              <Signup handleClose={handleClose} />
            )}
            <Box className={classes.google}>
              <span>OR</span>
              <GoogleButton
                onClick={handleGoogleLogin}
                style={{
                  marginTop: 12,
                  width: "100%",

                  outline: "none",
                }}
              />
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
