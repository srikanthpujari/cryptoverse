import { Container, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import Carousel from "./Carousel";

const useStyles = makeStyles({
  banner: {
    backgroundImage: "url(./banner.jpeg)",
  },
  bannerContent: {
    height: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  tagline: {
    display: "flex",
    flexDirection: "column",
    height: "40%",
    justifyContent: "center",
    textAlign: "center",
  },
});

const Banner = () => {
  const classes = useStyles();
  return (
    <div className={classes.banner}>
      <Container className={classes.bannerContent}>
        <div className={classes.tagline}>
          <Typography
            variant="h1"
            style={{
              color: "gold",
              fontFamily: "Roboto",
              fontSize: "bold",
              marginBottom: "12px",
            }}
          >
            CrytpoVerse
          </Typography>
          <Typography
            variant="subtitle2"
            style={{ color: "gray", textTransform: "capitalize" }}
          >
            One place for all your favorite currencies....
          </Typography>
        </div>
        <Carousel />
      </Container>
    </div>
  );
};

export default Banner;
