import { useSelector } from "react-redux";
import { forceNode, forceLink } from "../../../d";
import { useEffect, useState } from "react";
import DrawForceLink from "./drawForceLink";
import DrawNodes from "./drawNodes";
import DrawLabels from "./drawLabels";
import ForceGraphLegend from "./drawLegend";
import {
  calcScaleTransform,
  initForceGraphData,
  initSimulation,
} from "../../../utils/forceGraph";
import CircularProgress from "@mui/material/CircularProgress";

type DrawTreeProps = {
  chartHeight: number;
  chartWidth: number;
  chartMargin: number;
};

export const ForceGraph = (props: DrawTreeProps) => {
  const { chartHeight, chartWidth, chartMargin } = props;
  /** Initialize state */
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const colorScale: [string, string, string] = [
    "#4f2379",
    "#9475b3",
    "#d9cde3",
  ];

  // links and nodes that d3 has finished finding positions for
  const [positionedNodes, setPositionedNodes] = useState<forceNode[]>([]);
  const [positionedLinks, setPositionedLinks] = useState<forceLink[]>([]);
  const [scale, setScale] = useState<[number, number]>([1, 1]);
  const [translate, setTranslate] = useState<[number, number]>([0, 0]);
  const [ready, setReady] = useState<boolean>(false);

  // only run the simulation (once) if the tree or the mrca is changed
  useEffect(() => {
    const { forceNodes, forceLinks, nodes } = initForceGraphData(state.mrca);

    const maxDist =
      nodes.slice(-1)[0].node_attrs.div - state.mrca.node_attrs.div;
    const distanceMultiplier = chartWidth / (1.5 * maxDist);

    const simulation = initSimulation(
      forceNodes,
      forceLinks,
      distanceMultiplier,
      chartWidth,
      chartHeight
    );

    // wait until positions are assigned before scaling the svg
    simulation.on("end", () => {
      setPositionedLinks(forceLinks);
      setPositionedNodes(forceNodes);
      const { calcScale, calcTranslate } = calcScaleTransform(
        forceNodes,
        chartWidth,
        chartHeight,
        chartMargin
      );
      setScale(calcScale);
      setTranslate(calcTranslate);
      setReady(true);
    });
  }, [state.mrca, state.tree]);

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
          style={{ border: "1px solid pink" }}
          width={chartWidth}
          height={chartHeight}
        >
          <g
            transform={`scale(${scale[0]}, ${scale[1]}) translate(${translate[0]}, ${translate[1]})`}
          >
            {positionedNodes &&
              positionedLinks &&
              positionedLinks.map((forceLink: forceLink) => (
                <DrawForceLink
                  forceLink={forceLink}
                  forceNodes={positionedNodes}
                />
              ))}
            {positionedNodes && (
              <DrawNodes
                forceNodes={positionedNodes}
                colorScale={colorScale}
                chartHeight={chartHeight}
              />
            )}
            {/* <DrawLabels nodes={forceNodes} onNodeSelected={() => {}} /> */}
          </g>
          <ForceGraphLegend colorScale={colorScale} />
        </svg>
      )}
    </div>
  );
};

export default ForceGraph;
