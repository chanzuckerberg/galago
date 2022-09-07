import { Collapse, Alert, AlertTitle } from "@mui/material";
import { useState } from "react";
import { Theme } from "../../theme";

export const BetaBanner = () => {
  const [showAlert, setShowAlert] = useState<boolean>(true);

  return (
    <Collapse in={showAlert}>
      <Alert
        severity="info"
        style={{
          width: 450,
          height: 75,
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
          <strong>Galago is in beta - please share your feedback! </strong>
        </AlertTitle>
        <span style={{}}>
          We'd love to hear from you via{" "}
          <a href="https://github.com/chanzuckerberg/galago/discussions">
            <b>discussion board</b>
          </a>{" "}
          or{" "}
          <a href="mailto:galago@chanzuckerberg.com">
            <b>email</b>
          </a>
          .
        </span>
      </Alert>
    </Collapse>
  );
};
export default BetaBanner;
