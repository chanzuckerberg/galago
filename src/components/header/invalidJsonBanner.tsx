import { Collapse, Alert, AlertTitle } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { ACTION_TYPES } from "../../reducers/actionTypes";

export const InvalidJsonErrorBanner = () => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  return (
    <Collapse in={state.showTreeFormatError}>
      <Alert
        severity="error"
        style={{
          width: 450,
          height: 90,
          position: "absolute",
          top: 95,
          right: 0,
        }}
        onClose={() => {
          dispatch({ type: ACTION_TYPES.CLEAR_TREE_FORMAT_ERROR });
        }}
      >
        <AlertTitle>
          <strong>Woops! We can't read that tree file</strong>
        </AlertTitle>
        <span>
          We weren't able to parse your tree JSON file. If you believe this is
          in error, please{" "}
          <a href="mailto:galago@chanzuckerberg.com">get in touch</a> so we can
          improve!
        </span>
      </Alert>
    </Collapse>
  );
};

export default InvalidJsonErrorBanner;
