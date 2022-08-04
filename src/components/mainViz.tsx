import { useSelector } from "react-redux";
import { MutsDateScatter } from "./viz/mutsDateScatter";
import Button from "@mui/material/Button";
import ControlsDrawer from "./cladeSelection/controlsDrawer";
import Drawer from "@mui/material/Drawer";
import React, { useState } from "react";
import EpiCurve from "./viz/epiCurve";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useWindowSize } from "@react-hook/window-size";
import { useDispatch } from "react-redux";
import { FormControl, FormHelperText } from "@mui/material";
import { FormControlUnstyled } from "@mui/base";
import { ForceGraph } from "./viz/drawForceGraph";
import CladeSlider from "./cladeSelection/cladeSlider";

export const MainViz = () => {
  // @ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const viewPlot: "scatter" | "forceGraph" = state.viewPlot;
  const [windowWidth, windowHeight] = useWindowSize();

  const footerHeight = 10;
  const headerHeight = 220;
  const cladeControlsHeight = 100;
  const plotToggleHeight = 50;
  const extraHeight =
    headerHeight + footerHeight + cladeControlsHeight + plotToggleHeight;

  const chartMargin = 30;
  const chartWidth: number = windowWidth / 2 - chartMargin;
  const chartHeight = windowHeight - extraHeight;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: windowHeight - headerHeight - footerHeight,
        // border: "1px solid yellow",
      }}
    >
      <div>
        <CladeSlider chartWidth={chartWidth} />
      </div>
      <div style={{ width: chartWidth, height: chartHeight }}>
        {viewPlot === "forceGraph" && state.mrca ? (
          <ForceGraph
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            chartMargin={chartMargin}
          />
        ) : (
          <MutsDateScatter
            chartHeight={chartHeight}
            chartWidth={chartWidth}
            chartMargin={chartMargin}
          />
        )}
      </div>
      <div>
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
