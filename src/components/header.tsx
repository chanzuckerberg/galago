import { Helmet } from "react-helmet";
import { useWindowSize } from "@react-hook/window-size";
import { useState } from "react";
import Alert from "@mui/material/Alert/Alert";
import AlertTitle from "@mui/material/AlertTitle/AlertTitle";
import Collapse from "@mui/material/Collapse/Collapse";
import { Theme } from "../theme";

type HeaderProps = {
  sectionHeight?: number;
  sectionWidth?: number;
};

const Header = (props: HeaderProps) => {
  let { sectionHeight, sectionWidth } = props;
  const [showAlert, setShowAlert] = useState<boolean>(true);
  const [windowWidth, windowHeight] = useWindowSize();

  sectionHeight ??= 100;
  sectionWidth ??= windowWidth - 10;

  return (
    <div
      style={{
        width: sectionWidth,
        height: sectionHeight,
        // border: "1px solid pink",
        position: "relative",
        top: 0,
        left: 0,
      }}
    >
      <Collapse in={showAlert}>
        <Alert
          severity="info"
          style={{
            width: 450,
            height: 90,
            position: "absolute",
            top: 0,
            right: 0,
          }}
          onClose={() => {
            setShowAlert(false);
          }}
          //@ts-ignore
          sx={{ backgroundColor: Theme.palette.secondary.lighter }}
        >
          <AlertTitle>
            <strong>
              Galago is in alpha testing & may have bugs --
              <br /> stable beta launching early Sept!
            </strong>{" "}
            <br />
            <span style={{}}>
              We'd love your feedback!{" "}
              <a href="https://github.com/chanzuckerberg/galago/discussions">
                Discussion board
              </a>{" "}
              - <a href="mailto:galago@chanzuckerberg.com">Email.</a>
            </span>
          </AlertTitle>
        </Alert>
      </Collapse>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          fontSize: 24,
          margin: 0,
        }}
      >
        <img src="src/images/galago-logo.svg" height={50} />
      </div>
      <Helmet>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`Galago`}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Helmet>
    </div>
  );
};

export default Header;
