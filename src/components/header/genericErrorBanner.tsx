import { Collapse, Alert, AlertTitle } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { errorTypes } from "../../utils/errorTypes";

type GenericErrorBannerProps = {
  errorType: string;
  top: number;
};

export const GenericErrorBanner = (props: GenericErrorBannerProps) => {
  console.log("in the right component");
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const { errorType, top } = props;

  console.log(errorType, state.showErrorMessages);
  if (!Object.keys(state.showErrorMessages).includes(errorType)) {
    console.warn(
      "WARNING: error banner trying to render, but error type not specified in `Errors.ts` and/or `showErrorMessages` global state",
      errorType
    );
    return <></>;
  }

  const { title, content, onClose } = errorTypes[errorType];
  return (
    <Collapse in={state.showErrorMessages[errorType]}>
      <Alert
        severity="error"
        style={{
          width: 450,
          height: 90,
          position: "absolute",
          top: top,
          right: 0,
        }}
        onClose={() => {
          dispatch({ type: onClose });
        }}
      >
        <AlertTitle>
          <strong>{title}</strong>
        </AlertTitle>
        <span>{content}</span>
      </Alert>
    </Collapse>
  );
};

// export default GenericErrorBanner;
