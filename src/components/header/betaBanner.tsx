import { Collapse, Alert, AlertTitle } from "@mui/material";
import { useState } from "react";
import { Theme } from "../../theme";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes";

export const BetaBanner = () => {
  const [showAlert, setShowAlert] = useState<boolean>(true);

  return (
    <Collapse in={showAlert}>
      <Alert
        severity="warning"
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
          <strong>Galago is no longer regularly updated.</strong>
        </AlertTitle>
        <span style={{}}>
          For usage instructions, see the{" "}
          <Link target="_blank" rel="noreferrer noopener" to={ROUTES.FAQ}>
            FAQs
          </Link>{" "}
          and{" "}
          <Link target="_blank" rel="noreferrer noopener" to={ROUTES.FAQ}>
            Methods
          </Link>{" "}
          pages. For questions, contact{" "}
          <Link to="mailto:sidneymbell@gmail.com">Sidney Bell</Link>.
        </span>
      </Alert>
    </Collapse>
  );
};
export default BetaBanner;
