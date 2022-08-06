import { useSelector } from "react-redux";
import { CladeSelectionViz } from "./viz/cladeSelection";
import { useWindowSize } from "@react-hook/window-size";
import { useDispatch } from "react-redux";
import { ForceGraph } from "./viz/drawForceGraph";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

export const MainViz = () => {
  // @ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const viewPlot: "scatter" | "forceGraph" = state.viewPlot;
  const [windowWidth, windowHeight] = useWindowSize();

  const footerHeight = 10;
  const headerHeight = 215;
  const plotToggleHeight = 50;
  const extraHeight = headerHeight + footerHeight + plotToggleHeight;

  const chartMargin = 30;
  const chartWidth: number = windowWidth / 2 - chartMargin;
  const chartHeight = windowHeight - extraHeight;

  const showLayoutBorders = false;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
        height: windowHeight - headerHeight - footerHeight,
        border: showLayoutBorders ? "1px solid red" : "none",
      }}
    >
      <div
        style={{
          width: chartWidth + chartMargin,
          height: chartHeight,
          border: showLayoutBorders ? "1px solid purple" : "none",
        }}
      >
        {viewPlot === "forceGraph" && state.mrca ? (
          <ForceGraph
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            chartMargin={chartMargin}
          />
        ) : (
          <CladeSelectionViz
            chartHeight={chartHeight}
            chartWidth={chartWidth}
            chartMargin={chartMargin}
          />
        )}
      </div>
      <div
        style={{
          width: chartWidth,
          height: plotToggleHeight,
          position: "relative",
          top: 0,
          left: chartWidth - 525,
        }}
      >
        <ToggleButtonGroup
          value={viewPlot}
          exclusive
          onChange={(e, v) => dispatch({ type: "view plot toggled", data: v })}
          aria-label="viewPlotSelection"
          size="small"
          style={{ height: 30 }}
        >
          <ToggleButton value="scatter" disableRipple>
            Scatterplot of all clades
          </ToggleButton>
          <ToggleButton value="forceGraph" disabled={!state.mrca} disableRipple>
            Network diagram for selected clade
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
};

export default MainViz;
