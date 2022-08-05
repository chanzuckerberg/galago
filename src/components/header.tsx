import { Alert, AlertTitle, Collapse } from "@mui/material";
import { Helmet } from "react-helmet";
import { useWindowSize } from "@react-hook/window-size";
import { useState } from "react";

const Header = () => {
  const [windowWidth, windowHeight] = useWindowSize();
  const [showAlert, setShowAlert] = useState<boolean>(true);

  return (
    <div>
      {/* <Alert
        severity="info"
        style={{
          width: windowWidth * 0.66,
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <AlertTitle>
          <strong>
            Galago is still an early-stage prototype - we'd love your feedback!
          </strong>{" "}
          You can reach us either{" "}
          <a href="https://github.com/chanzuckerberg/galago/discussions">
            on our discussion board
          </a>{" "}
          or <a href="mailto:galago@chanzuckerberg.com">via email.</a>
        </AlertTitle>
        We're continually working to improve Galago, and plan to release a
        stable version in a few months. Please pardon our dust (and don't use
        Galago for decision making just yet).
      </Alert> */}

      <p
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          fontSize: 24,
          margin: 0,
        }}
      >
        Galago
      </p>
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
