import { useSelector } from "react-redux";
import { MutsDateScatter } from "./viz/mutsDateScatter";
import Button from "@mui/material/Button";
import ControlsDrawer from "./controlsDrawer";
import Drawer from "@mui/material/Drawer";
import React, { useState } from "react";
import EpiCurve from "./viz/epiCurve";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useWindowSize } from "@react-hook/window-size";
import { useDispatch } from "react-redux";

export const MainViz = () => {
  // @ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const viewPlot: "scatter" | "epiCurve" = state.viewPlot;
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [windowWidth, windowHeight] = useWindowSize();

  const chartWidth = windowWidth / 2;
  const chartHeight = (windowWidth / 2) * 0.666; // 3:2 aspect ratio
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

        <ToggleButtonGroup
          exclusive
          onChange={(e, v) => dispatch({ type: "view plot toggled", data: v })}
          aria-label="viewPlotSelection"
          size="small"
        >
          <ToggleButton value="scatter" disableRipple>
            Scatterplot of all clades
          </ToggleButton>
          <ToggleButton value="epiCurve" disabled={!state.mrca} disableRipple>
            Epi curve for selected clade
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div
        style={{ width: chartWidth, height: chartHeight, margin: chartMargin }}
      >
        {viewPlot === "epiCurve" && state.mrca ? (
          <EpiCurve
            chartHeight={chartHeight}
            chartWidth={chartWidth}
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
