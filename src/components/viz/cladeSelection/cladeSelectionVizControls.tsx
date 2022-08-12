import { useSelector, useDispatch } from "react-redux";
import { Button, Drawer, Tooltip } from "@mui/material";
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

  const darkPurple = "#4f2379";
  const darkestGray = "rgba(80,80,80,1)";

  const getFilterButtonTooltipText = () => {
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
        id="clade selection slider"
        style={{ width: sectionWidth - 250, flexShrink: 0 }}
      >
        <CladeSlider />
      </div>

      <div
        id="clade selection dropdown"
        style={{ width: 100, position: "relative", top: 7 }}
      >
        <CladeSelector />
      </div>
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
            onClick={() => setDrawerOpen(true)}
            size="small"
            sx={{
              fontSize: 10,
              color: darkPurple,
              borderColor: darkPurple,
              margin: 0,
              width: 50,
              "&:hover": {
                backgroundColor: "#f2f0f0",
                color: "#6D4F8A",
                borderColor: darkPurple,
              },
            }}
            variant="outlined"
          >
            Filter clusters
          </Button>
        </Tooltip>
        <Drawer
          anchor={"right"}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <div style={{ width: windowWidth * 0.4 }}>
            <CladeFilterDrawer />
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default CladeSelectionVizControls;
