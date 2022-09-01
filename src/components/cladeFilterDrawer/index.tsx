import SamplesOfInterest from "./samplesOfInterest";
import ClusteringOptions from "./clusteringMethodSelect";
import { useWindowSize } from "@react-hook/window-size";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";
import { tooltipProps } from "../formatters/sidenote";
import Button from "@mui/material/Button";

export const CladeFilterDrawer = () => {
  const [windowWidth, windowHeight] = useWindowSize();
  const dispatch = useDispatch();

  return (
    <div
      style={{
        width: windowWidth * 0.33,
        margin: "auto",
        marginTop: 50,
        paddingBottom: 100,
        marginRight: windowWidth * 0.085,
      }}
    >
      <div>
        <h1>Filter clades (preview on the left)</h1>
        <ClusteringOptions />
        <Divider variant="middle" style={{ margin: 30 }} />
        <SamplesOfInterest />

        <div
          style={{
            position: "fixed",
            bottom: 0,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: windowWidth * 0.085,
            left: windowWidth * 0.5,
            height: 40,
            width: windowWidth * 0.5,
            backgroundColor: "white",
            borderTop: "1px solid lightGray",
          }}
        >
          <div>
            <Tooltip
              title="Apply new filters (previewed to the left)"
              componentsProps={tooltipProps}
              arrow
            >
              <Button
                variant="contained"
                size="large"
                color="primary"
                aria-label="apply"
                onClick={() => {
                  dispatch({ type: "filter drawer changes applied" });
                }}
                sx={{ paddingLeft: 5, paddingRight: 5, marginRight: 3 }}
              >
                Apply
              </Button>
            </Tooltip>
            <Tooltip
              title="Discard changes"
              componentsProps={tooltipProps}
              arrow
            >
              <Button
                variant="text"
                size="large"
                color="primary"
                aria-label="cancel"
                onClick={() => {
                  dispatch({ type: "filter drawer changes cancelled" });
                }}
              >
                CANCEL
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CladeFilterDrawer;
