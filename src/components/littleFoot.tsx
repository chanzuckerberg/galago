import Divider from "@mui/material/Divider";
import Theme from "../theme";
import { Link } from "react-router-dom";
import { ROUTES } from "src/routes";

const LittleFoot = () => {
  return (
    <div
      style={{
        //@ts-ignore
        backgroundColor: Theme.palette.secondary.lighter,
        height: "20px",
        maxHeight: "20px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 5,
        borderRadius: 5,
      }}
    >
      <div style={{ fontSize: 12 }}>
        <b>Galago | </b>a little tree explorer made with &hearts; by Sidney Bell
        & Colin Megill &#11825; Free and open: MIT & CC0 licenses
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: 300,
          fontSize: 12,
        }}
      >
        <Link
          target="_blank"
          rel="noreferrer noopener"
          style={{
            textDecoration: "none",
          }}
          to={ROUTES.FAQ}
        >
          FAQs
        </Link>
        <Link
          target="_blank"
          rel="noreferrer noopener"
          style={{
            textDecoration: "none",
          }}
          to={ROUTES.METHODS}
        >
          Methods
        </Link>
        <a
          href="mailto:sidneymbell@gmail.com"
          style={{ textDecoration: "none" }}
        >
          Contact Us
        </a>
        <a
          href="https://github.com/chanzuckerberg/galago"
          style={{ textDecoration: "none" }}
        >
          Github
        </a>
      </div>
    </div>
  );
};

export default LittleFoot;
