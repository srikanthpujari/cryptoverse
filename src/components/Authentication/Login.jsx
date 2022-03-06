import { Box, Button, TextField } from "@material-ui/core";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { CoinsState } from "../../context/CoinsProvider";
import { auth } from "../../firebase";

const Login = ({ handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAlert } = CoinsState();

  const handleSubmit = async () => {
    if (!email || !password) {
      setAlert({
        open: true,
        severity: "error",
        message: "Please enter all the fields",
      });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      setAlert({
        open: true,
        severity: "success",
        message: `Welcome to CryptoVerse, ${result.user.email}`,
      });

      handleClose();
    } catch (error) {
      setAlert({
        open: true,
        severity: "error",
        message: error.message,
      });
    }
  };

  return (
    <Box p={2} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <TextField
        required
        label="Enter Email"
        type="email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        required
        label="Enter Password"
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        size="large"
        style={{
          backgroundColor: "gold",
          color: "black",
        }}
        onClick={handleSubmit}
      >
        Login
      </Button>
    </Box>
  );
};
export default Login;
