import { useSelector } from "react-redux";
import { MutsDateScatter } from "./viz/mutsDateScatter";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Card, Popper } from "@mui/material";
import React, { useState } from "react";
import SamplesOfInterest from "./cladeSelection/samplesOfInterest";
import ClickAwayListener from "@mui/material/ClickAwayListener";

export const MainViz = () => {
  // @ts-ignore
  const state = useSelector((state) => state.global);
  const [viewPlot, setViewPlot] = useState<"scatter" | "tree">(
    state.mrca ? "tree" : "scatter"
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(true);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const id = open ? "simple-popper" : undefined;

  const chartWidth = 960;
  const chartHeight = 560;
  const chartMargin = 30;

  const controlWidth = 250;

  const samplesButtonRef = React.useRef();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          color="secondary"
          style={{ marginRight: 10 }}
          onClick={handleButtonClick}
        >
          Samples of Interest ({state.samplesOfInterest.length})
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <ClickAwayListener onClickAway={handleClickAway}>
            <Card style={{ padding: 15, width: controlWidth }}>
              <SamplesOfInterest />
            </Card>
          </ClickAwayListener>
        </Popper>

        <Button color="secondary" style={{ marginRight: 10 }}>
          Cluster method
        </Button>

        <ButtonGroup
          color="secondary"
          aria-label="toggle-plot"
          size="small"
          disableElevation
        >
          <Button onClick={(e) => setViewPlot("scatter")}>
            Select new clade
          </Button>
          <Button onClick={(e) => setViewPlot("tree")} disabled={!state.mrca}>
            View subtree of selected clade
          </Button>
        </ButtonGroup>
      </div>

      <div
        style={{ width: chartWidth, height: chartHeight, margin: chartMargin }}
      >
        {viewPlot === "tree" && state.mrca ? (
          <img
            style={{ width: chartWidth, height: chartHeight }}
            src="https://user-images.githubusercontent.com/12618847/173690423-12b8d1f1-c4b7-4d82-be75-740762fddb81.png"
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
