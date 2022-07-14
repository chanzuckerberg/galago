import { useSelector } from "react-redux";
import { forceNode, forceLink } from "../../../d";
import { useEffect, useState } from "react";
import DrawForceLink from "./drawForceLink";
import DrawNodes from "./drawNodes";
import DrawLabels from "./drawLabels";
import DrawHull from "./drawHull";
import ForceGraphLegend from "./drawLegend";
import {
  initForceGraphData,
  initSimulation,
  polytomiesIdxToForceNode,
} from "../../../utils/forceGraph";

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

  // only run the simulation (once) if the tree or the mrca is changed
  useEffect(() => {
    const { forceNodes, forceLinks, polytomiesIdx, nodes } = initForceGraphData(
      state.mrca
    );

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

    // wait until positions are assigned before updating the svg
    simulation.on("end", () => {
      setPositionedNodes(forceNodes);
      setPositionedLinks(forceLinks);
    });
  }, [state.mrca, state.tree]);

  return (
    <div>
      <svg
        style={{ border: "1px solid pink" }}
        width={chartWidth}
        height={chartHeight}
      >
        {/* {positionedPolytomies &&
          positionedPolytomies.map((pt: forceNode[]) => (
            <DrawHull polytomyNodes={pt} />
          ))} */}

        {positionedNodes &&
          positionedLinks &&
          positionedLinks.map((forceLink: forceLink) => (
            <DrawForceLink forceLink={forceLink} forceNodes={positionedNodes} />
          ))}
        {positionedNodes && (
            <DrawNodes
              forceNodes={positionedNodes}
              colorScale={colorScale}
              chartHeight={chartHeight}
            />
        )}
        <ForceGraphLegend colorScale={colorScale} />
        {/* <DrawLabels nodes={forceNodes} onNodeSelected={() => {}} /> */}
      </svg>
    </div>
  );
};

export default ForceGraph;
