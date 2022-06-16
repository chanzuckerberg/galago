import { useSelector } from "react-redux";
import { MutsDateScatter } from "./viz/mutsDateScatter";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Card, Popper } from "@mui/material";
import React, { useState } from "react";
import SamplesOfInterest from "./cladeSelection/samplesOfInterest";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import ClusteringOptions from "./cladeSelection/clusteringMethodSelect";
import EpiCurve from "./viz/epiCurve";

export const MainViz = () => {
  // @ts-ignore
  const state = useSelector((state) => state.global);
  const [viewPlot, setViewPlot] = useState<"scatter" | "epiCurve">(
    state.mrca ? "scatter" : "epiCurve"
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [samplesOfInterestOpen, setSamplesOfInterestOpen] =
    React.useState(false);
  const [clusteringOpen, setClusteringOpen] = React.useState(false);

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
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
            setSamplesOfInterestOpen(true);
          }}
        >
          Samples of Interest ({state.samplesOfInterest.length}) 🔽
        </Button>
        <Popper
          id={"samplesOfInterest"}
          open={samplesOfInterestOpen}
          anchorEl={anchorEl}
        >
          <ClickAwayListener
            onClickAway={(e) => setSamplesOfInterestOpen(false)}
          >
            <Card style={{ padding: "0 20 20 20", width: controlWidth }}>
              <SamplesOfInterest />
            </Card>
          </ClickAwayListener>
        </Popper>

        <Button
          color="secondary"
          style={{ marginRight: 10 }}
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
            setClusteringOpen(true);
          }}
        >
          Cluster method 🔽
        </Button>
        <Popper id={"clustering"} open={clusteringOpen} anchorEl={anchorEl}>
          <ClickAwayListener onClickAway={(e) => setClusteringOpen(false)}>
            <Card style={{ padding: "0 20 20 20", width: controlWidth }}>
              <ClusteringOptions />
            </Card>
          </ClickAwayListener>
        </Popper>

        <ButtonGroup
          color="secondary"
          aria-label="toggle-plot"
          size="small"
          disableElevation
        >
          <Button onClick={(e) => setViewPlot("scatter")}>
            Scatterplot of all clades
          </Button>
          <Button
            onClick={(e) => setViewPlot("epiCurve")}
            disabled={!state.mrca}
          >
            Epi curve for selected clade
          </Button>
        </ButtonGroup>
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
