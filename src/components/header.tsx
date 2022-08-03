import { Alert, AlertTitle, Collapse } from "@mui/material";
import { Helmet } from "react-helmet";
import { useWindowSize } from "@react-hook/window-size";
import { useState } from "react";

const Header = () => {
  const [windowWidth, windowHeight] = useWindowSize();
  const [showAlert, setShowAlert] = useState<boolean>(true);

  return (
    <div>
      <Collapse in={showAlert}>
        <Alert
          severity="info"
          style={{
            width: 430,
            height: 60,
            position: "absolute",
            top: 0,
            right: 0,
          }}
          onClose={() => {
            setShowAlert(false);
          }}
        >
          <AlertTitle>
            <strong>Galago is in beta - we'd love your feedback!</strong>{" "}
            <span style={{}}>
              <a href="https://github.com/chanzuckerberg/galago/discussions">
                Discussion board
              </a>{" "}
              - <a href="mailto:galago@chanzuckerberg.com">Email.</a>
            </span>
          </AlertTitle>
        </Alert>
      </Collapse>

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
