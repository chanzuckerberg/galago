import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import { ROUTES } from "src/routes";

const BigFoot = () => {
  return (
    <div // entire footer
      style={{
        position: "relative",
        bottom: 0,
        left: 0,
        backgroundColor: "#333",
        color: "#FFF",
        // height: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "5px 15px 20px 20px",
        margin: 0,
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
      }}
    >
      <div // top row
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div // top left
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              color: "white",
              fontFamily: "Noto Sans",
              fontWeight: "bold",
              fontSize: 20,
              paddingRight: 3,
            }}
          >
            Galago
          </span>
        </div>
        <div // top right
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            width: 300,
            height: 35,
            alignItems: "flex-end",
          }}
        >
          <Link
            target="_blank"
            rel="noreferrer noopener"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "0px 12px",
            }}
            to={ROUTES.FAQ}
          >
            FAQs
          </Link>
          <Link
            target="_blank"
            rel="noreferrer noopener"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "0px 12px",
            }}
            to={ROUTES.METHODS}
          >
            Methods
          </Link>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="mailto:sidneymbell@gmail.com"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "0px 12px",
            }}
          >
            Contact
          </a>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/chanzuckerberg/galago"
            style={{ color: "white", textDecoration: "none", paddingLeft: 12 }}
          >
            Github
          </a>
        </div>
      </div>
      <div //bottom left
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div>
          <span
            style={{
              color: "white",
              fontSize: 12,
              width: 400,
            }}
          >
            a little tree explorer made with &hearts; by Sidney Bell & Colin
            Megill
          </span>
        </div>
        <div // bottom right
          style={{
            fontSize: 12,
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
          }}
        >
          License: MIT (code) & CC0 (content)
        </div>
      </div>
    </div>
  );
};

export default BigFoot;
