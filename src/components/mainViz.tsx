import { useSelector } from "react-redux";
import { CladeSelectionViz } from "./viz/cladeSelection";
import { useDispatch } from "react-redux";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import UnrootedTree from "./viz/unrootedTree";

type MainVizProps = {
  sectionHeight: number;
  sectionWidth: number;
};

export const MainViz = (props: MainVizProps) => {
  // @ts-ignore
  const state = useSelector((state) => state.global);
  const { sectionHeight, sectionWidth } = props;
  const dispatch = useDispatch();
  const viewPlot: "scatter" | "unrootedTree" = state.viewPlot;

  const plotToggleHeight = 50;

  const chartMargin = 30;
  const chartWidth: number = sectionWidth;
  const chartHeight = sectionHeight - plotToggleHeight;

  const showLayoutBorders = false;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: sectionHeight,
        width: sectionWidth,
        paddingTop: 25,
        border: showLayoutBorders ? "1px solid red" : "none",
      }}
    >
      <div
        style={{
          width: sectionWidth,
          height: chartHeight,
          border: showLayoutBorders ? "1px solid purple" : "none",
        }}
      >
        {viewPlot === "unrootedTree" && state.mrca ? (
          <UnrootedTree
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
          <ToggleButton
            value="unrootedTree"
            disabled={!state.mrca}
            disableRipple
          >
            Network diagram for selected clade
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
};

export default MainViz;
