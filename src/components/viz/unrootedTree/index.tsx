import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DrawUnrootedTree from "./drawUnrootedTree";
import UnrootedTreeLegend from "./unrootedTreeLegend";
import CircularProgress from "@mui/material/CircularProgress";
import Theme from "../../../theme";
import { Node } from "../../../d";
import { initializeEqualAnglePolarCoordinates } from "../../../utils/unrootedTree";
import { Tooltip, useTooltip } from "@visx/tooltip";

type unrootedTreeProps = {
  chartHeight: number;
  chartWidth: number;
  chartMargin: number;
};

export const unrootedTree = (props: unrootedTreeProps) => {
  const { chartHeight, chartWidth, chartMargin } = props;
  /** Initialize state */
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const colorScale: [string, string, string] = [
    Theme.palette.primary.dark,
    Theme.palette.primary.light,
    //@ts-ignore
    Theme.palette.primary.lighter,
  ];

  const [scaleDomainX, setScaleDomainX] = useState<[number, number]>([
    0,
    chartWidth,
  ]);
  const [scaleDomainY, setScaleDomainY] = useState<[number, number]>([
    0,
    chartHeight,
  ]);
  const [scaleDomainR, setScaleDomainR] = useState<[number, number]>([1, 10]);
  const [ready, setReady] = useState<boolean>(false);

  // only run the simulation (once) if the tree or the mrca is changed
  useEffect(() => {
    setReady(false);
    const { minX, maxX, minY, maxY, maxSize } =
      initializeEqualAnglePolarCoordinates(state.mrca);

    setScaleDomainR([1, maxSize]);
    setScaleDomainX([minX, maxX]);
    setScaleDomainY([minY, maxY]);
    setReady(true);
    // setReady(true);
  }, [state.mrca, state.tree]);

  const tooltip = useTooltip();

  return (
    <div>
      {!ready && (
        <div
          style={{
            position: "relative",
            top: chartHeight / 2 - 37.5,
            left: chartWidth / 2 - 37.5,
          }}
        >
          <CircularProgress variant="indeterminate" size={75} color="primary" />
        </div>
      )}
      {ready && (
        <svg
          // style={{ border: "1px solid pink" }}
          width={chartWidth}
          height={chartHeight}
        >
          <DrawUnrootedTree
            colorScale={colorScale}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            chartMargin={chartMargin}
            scaleDomainX={scaleDomainX}
            scaleDomainY={scaleDomainY}
            scaleDomainR={scaleDomainR}
            tooltip={tooltip}
          />
          <UnrootedTreeLegend
            colorScale={colorScale}
            smallWindow={chartHeight < 200}
          />
        </svg>
      )}
      {ready && tooltip.tooltipOpen && tooltip.tooltipData && (
        <Tooltip top={tooltip.tooltipTop} left={tooltip.tooltipLeft}>
          <div style={{ maxWidth: 150 }}>
            {/* @ts-ignore */}
            <p>{tooltip.tooltipData.map((n: Node) => n.name).join(", ")}</p>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default unrootedTree;
