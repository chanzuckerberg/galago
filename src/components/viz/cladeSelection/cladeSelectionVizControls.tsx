import { useSelector, useDispatch } from "react-redux";
import { Button, Tooltip } from "@mui/material";
import CladeFilterDrawer from "../../cladeFilterDrawer";
import { tooltipProps } from "../../formatters/sidenote";
import CladeSelector from "./cladeSelector";
import CladeSlider from "./cladeSlider";

type CladeSelectionVizControlsProps = {
  sectionWidth: number;
};

export const CladeSelectionVizControls = (
  props: CladeSelectionVizControlsProps
) => {
  const { sectionWidth } = props;

  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

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
        <CladeSlider />
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
