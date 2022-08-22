import Divider from "@mui/material/Divider";
import Theme from "../theme";

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
        <b>Galago | </b>a little tree explorer made with &hearts; by the CZ GEN
        EPI team &#11825; Code: MIT licensed &#11825; Content: CC0 licensed
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: 450,
          fontSize: 12,
        }}
      >
        <a
          href="https://help.czgenepi.org/hc/en-us/categories/6217716150804-Genomic-Epidemiology-Learning-Center"
          style={{ textDecoration: "none" }}
        >
          Learning Center
        </a>
        <a
          href="https://github.com/chanzuckerberg/galago/discussions"
          style={{ textDecoration: "none" }}
        >
          Discussion Board
        </a>
        <a
          href="mailto:galago@chanzuckerberg.com"
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
        <a href="https://czgenepi.org/">
          <img
            src="https://github.com/chanzuckerberg/czgenepi/raw/trunk/src/frontend/public/CZGenEpiLogoBlack.svg"
            style={{ height: "15px" }}
          />
        </a>
      </div>
    </div>
  );
};

export default LittleFoot;
