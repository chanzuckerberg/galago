import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import { ROUTES } from "src/routes";

const BigFoot = () => {
  return (
    <div
      style={{
        position: "relative",
        bottom: 0,
        left: 0,
        backgroundColor: "#333",
        color: "#FFF",
        height: 50,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
        margin: 0,
        borderRadius: 5,
      }}
    >
      <div // content on the left
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <div // first row on left
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <img
            src="https://github.com/chanzuckerberg/galago/raw/main/src/images/czge-logo.svg"
            style={{ width: 20, marginRight: 10 }}
          />
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{
              bgcolor: "secondary.light",
              height: 20,
              position: "relative",
              top: 15,
            }}
          />

          <h2 style={{ color: "white", marginLeft: 10 }}>Galago</h2>
        </div>
        <div // second row on left
          style={{
            color: "white",
            fontSize: 12,
            width: 400,
            position: "relative",
            top: -10,
          }}
        >
          a little tree explorer made with &hearts; by the CZ GEN EPI team
        </div>
      </div>
      <div // content on the right
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          color: "white",
        }}
      >
        <div // first row on the right
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: 700,
            maxWidth: 700,
            position: "relative",
            top: 12,
          }}
        >
          <Link
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: "white", textDecoration: "none" }}
            to={ROUTES.FAQ}
          >
            FAQs
          </Link>
          <Link
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: "white", textDecoration: "none" }}
            to={ROUTES.METHODS}
          >
            Methods
          </Link>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://help.czgenepi.org/hc/en-us/categories/6217716150804-Genomic-Epidemiology-Learning-Center"
            style={{ color: "white", textDecoration: "none" }}
          >
            Learning Center
          </a>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/chanzuckerberg/galago/discussions"
            style={{ color: "white", textDecoration: "none" }}
          >
            Discussion Board
          </a>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="mailto:galago@chanzuckerberg.com"
            style={{ color: "white", textDecoration: "none" }}
          >
            Contact Us
          </a>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/chanzuckerberg/galago"
            style={{ color: "white", textDecoration: "none" }}
          >
            Github
          </a>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://czgenepi.org/"
          >
            <img
              src="https://github.com/chanzuckerberg/czgenepi/raw/trunk/src/frontend/src/common/images/logo_complete_white.svg"
              style={{ width: 100 }}
            />
          </a>
        </div>
        <div
          style={{
            fontSize: 12,
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            paddingRight: 16,
            paddingTop: 20,
          }}
        >
          License: MIT (code) & CC0 (content)
        </div>
      </div>
    </div>
  );
};

export default BigFoot;
