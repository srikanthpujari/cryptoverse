import { makeStyles } from "@material-ui/core";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Coins from "./pages/Coins";
import Home from "./pages/Home";

const useStyles = makeStyles({
  app: {
    backgroundColor: "black",
    minHeight: "100vh",
    color: "white",
  },
});

function App() {
  const classes = useStyles();
  return (
    <div className={classes.app}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/coins/:id" element={<Coins />}></Route>
      </Routes>
    </div>
  );
}

export default App;
