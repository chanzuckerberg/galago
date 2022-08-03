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

export const MainViz = () => {
  // @ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const viewPlot: "scatter" | "forceGraph" = state.viewPlot;
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [windowWidth, windowHeight] = useWindowSize();

  const stateCuesHeight = 40;
  const footerHeight = 10;
  const headerHeight = 100;
  const extraHeight = headerHeight + footerHeight + stateCuesHeight + 190;

  const chartWidth = windowWidth / 2;
  const chartHeight = Math.min(
    ...[(windowWidth / 2) * 0.666, windowHeight - extraHeight]
  ); // 3:2 aspect ratio
  const chartMargin = 30;

  const toggleDrawer =
    (anchor: string, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setDrawerOpen(open);
      if (open) {
        dispatch({ type: "view plot toggled", data: "scatter" });
      }
    };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <FormControl>
          <React.Fragment key={"controlsDrawer"}>
            <Button
              disableElevation
              disableRipple
              variant="contained"
              onClick={toggleDrawer("controlsDrawer", true)}
            >
              Filter and suggest clades
            </Button>
            <Drawer
              anchor={"right"}
              open={drawerOpen}
              onClose={toggleDrawer("right", false)}
            >
              <div style={{ width: windowWidth * 0.4 }}>
                <ControlsDrawer />
              </div>
            </Drawer>
          </React.Fragment>
          {/* @ts-ignore */}
          <FormHelperText size="small">
            Samples of interest: <u>{state.samplesOfInterestNames.length}</u>
            <br />
            Clustering: <u>{state.clusteringMethod}</u>
            {state.clusteringMethod !== "none" &&
              state.clusteringMetadataField && (
                <>
                  {" "}
                  on <u>{state.clusteringMetadataField}</u>
                </>
              )}
          </FormHelperText>
        </FormControl>

        <ToggleButtonGroup
          exclusive
          onChange={(e, v) => dispatch({ type: "view plot toggled", data: v })}
          aria-label="viewPlotSelection"
          size="small"
          style={{ height: 40 }}
        >
          <ToggleButton value="scatter" disableRipple>
            Scatterplot of all clades
          </ToggleButton>
          <ToggleButton value="forceGraph" disabled={!state.mrca} disableRipple>
            Network diagram for selected clade
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div
        style={{ width: chartWidth, height: chartHeight, margin: chartMargin }}
      >
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
    </div>
  );
};

export default MainViz;
