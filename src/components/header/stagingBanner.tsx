import { Collapse, Alert, AlertTitle } from "@mui/material";
import { useState } from "react";
import { Theme } from "../../theme";

export const StagingBanner = () => {
  const [showAlert, setShowAlert] = useState<boolean>(true);

  return (
    <Collapse in={showAlert}>
      <Alert
        severity="warning"
        style={{
          width: 450,
          height: 80,
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <AlertTitle>
          <strong>
            This is Galago <i>Labs</i>{" "}
          </strong>
        </AlertTitle>
        <span style={{}}>
          This is where we experiment! Things might break.
          <br />
          <a href="https://galago.czgenepi.org">
            <b>Take me to the stable version of Galago</b>
          </a>
        </span>
      </Alert>
    </Collapse>
  );
};
export default StagingBanner;
