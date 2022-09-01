import SamplesOfInterest from "./samplesOfInterest";
import ClusteringOptions from "./clusteringMethodSelect";
import { useWindowSize } from "@react-hook/window-size";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { tooltipProps } from "../formatters/sidenote";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";

export const CladeFilterDrawer = () => {
  const [windowWidth, windowHeight] = useWindowSize();
  const dispatch = useDispatch();
  //@ts-ignore
  const state = useSelector((state) => state.global)

  const totalWidth = windowWidth * 0.5;
  const contentWidth = windowWidth * 0.33;
  const marginWidth = (totalWidth - contentWidth)/2

  return (

    <Drawer anchor={"right"} open={state.filterDrawerOpen}>
    <div style={{ width: totalWidth}}>
      <div style={{width: contentWidth, margin: "auto", paddingBottom: 100}}>
      <h1>Filter clades (preview on the left)</h1>
      <Divider variant="middle" style={{ margin: 30 }} />
        <ClusteringOptions />
        <Divider variant="middle" style={{ margin: 30 }} />
        <SamplesOfInterest />
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: totalWidth + 15,
          paddingLeft: marginWidth,
          height: 40,
          width: totalWidth - 15,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: "white",
          borderTop: "1px solid lightGray",
          zIndex: 100000,
        }}
      >
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
              sx={{ paddingLeft: 5, paddingRight: 5, marginRight: 3}}
            >
              Apply
            </Button>
          </Tooltip>
          <Tooltip title="Discard changes" componentsProps={tooltipProps} arrow>
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
    </Drawer>
  );
};

export default CladeFilterDrawer;
