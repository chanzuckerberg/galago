import { useSelector, useDispatch } from "react-redux";
import { Button, Drawer, Tooltip, useTheme } from "@mui/material";
import CladeFilterDrawer from "../../cladeFilterDrawer";
import { useWindowSize } from "@react-hook/window-size";
import { tooltipProps } from "../../formatters/sidenote";
import { useState } from "react";
import CladeSelector from "./cladeSelector";
import CladeSlider from "./cladeSlider";

type CladeSelectionVizControlsProps = {
  sectionWidth: number;
};

export const CladeSelectionVizControls = (
  props: CladeSelectionVizControlsProps
) => {
  const { sectionWidth } = props;
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [windowWidth, windowHeight] = useWindowSize();

  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const getFilterButtonTooltipText = () => {
    const theme = useTheme();
    if (state.samplesOfInterestNames.length || state.clusteringMethod) {
      return `Samples of interest: ${state.samplesOfInterestNames.length}  |
  Clustering: ${state.clusteringMethod ? state.clusteringMethod : "none"}
  ${
    state.clusteringMetadataField && state.clusterMethod
      ? "on " + state.metadataField
      : ""
  }`;
    } else {
      return "Locate samples of interest and filter clades";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        position: "relative",
        width: sectionWidth,
        // paddingLeft: 25,
        // border: "1px solid purple",
      }}
    >
      <div
        id="clade filter drawer toggle button"
        style={{
          position: "relative",
          top: 11,
        }}
      >
        <Tooltip
          title={getFilterButtonTooltipText()}
          componentsProps={tooltipProps}
        >
          <Button
            onClick={() => dispatch({ type: "filter drawer opened" })}
            size="small"
            sx={{
              fontSize: 10,
              margin: 0,
              // width: 50,
            }}
            variant="contained"
          >
            Search & filter
          </Button>
        </Tooltip>
      </div>
      <div
        id="clade selection slider"
        style={{ width: sectionWidth - 275, flexShrink: 0 }}
      >
        {/* <CladeSlider /> */}
      </div>

      <div
        id="clade selection dropdown"
        style={{ width: 100, position: "relative", top: 7 }}
      >
        <CladeSelector />
      </div>
      <CladeFilterDrawer />
    </div>
  );
};

export default CladeSelectionVizControls;
