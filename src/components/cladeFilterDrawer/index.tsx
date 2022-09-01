import SamplesOfInterest from "./samplesOfInterest";
import CaseDefinitionConstructor from "./caseDefinitionConstructor";
import ClusteringOptions from "./clusteringMethodSelect";
import { useWindowSize } from "@react-hook/window-size";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import ClearIcon from "@mui/icons-material/Clear";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";
import { tooltipProps } from "../formatters/sidenote";

export const CladeFilterDrawer = () => {
  const [windowWidth, windowHeight] = useWindowSize();
  const dispatch = useDispatch();

  return (
    <div
      style={{
        width: windowWidth * 0.4,
        margin: "auto",
        marginTop: 50,
        paddingBottom: 100,
      }}
    >
      <div>
        <h1>Filter clades (preview on the left)</h1>
        <ClusteringOptions />
        <Divider variant="middle" style={{ margin: 30 }} />

        <div
          style={{
            position: "fixed",
            bottom: 10,
            right: 50,
            display: "flex",
            flexDirection: "row",
            width: 130,
            justifyContent: "space-between",
          }}
        >
          <Tooltip
            title="Apply new filters (previewed to the left)"
            componentsProps={tooltipProps}
            arrow
          >
            <Fab
              variant="extended"
              size="large"
              color="primary"
              aria-label="apply"
              onClick={() => {
                dispatch({ type: "filter drawer changes applied" });
              }}
            >
              Apply
            </Fab>
          </Tooltip>
          <Tooltip title="Discard changes" componentsProps={tooltipProps} arrow>
            <Fab
              size="small"
              color="secondary"
              aria-label="cancel"
              onClick={() => {
                dispatch({ type: "filter drawer changes cancelled" });
              }}
            >
              <ClearIcon />
            </Fab>
          </Tooltip>
        </div>
        <SamplesOfInterest />
      </div>
    </div>
  );
};

export default CladeFilterDrawer;
