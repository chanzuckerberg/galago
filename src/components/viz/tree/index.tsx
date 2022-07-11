import { useSelector } from "react-redux";
import { traverse_preorder } from "../../../utils/treeMethods";
import { Node, Point, D3Datum } from "../../../d";
import * as d3 from "d3";
import * as React from "react";
import { Simulation, SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import { useState } from "react";
import DrawLinks from "./drawLinks";
import DrawNodes from "./drawNodes";
import DrawLabels from "./drawLabels";

type DrawTreeProps = {
  chartHeight: number;
  chartWidth: number;
  chartMargin: number;
  onNodeSelected: any;
};

export const DrawTree = (props: DrawTreeProps) => {
  const { chartHeight, chartWidth, chartMargin, onNodeSelected } = props;
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const [simulationIsFinished, setSimulationIsFinished] =
    useState<boolean>(false);
  const [positionedNodes, setPositionedNodes] = useState<SimulationNodeDatum[]>(
    []
  );

  /**
   * 1. check for data
   * 2. create nodes and links
   * 3. pass them to the simulation
   * 4. wait for simulation to end -> set state with final data
   * 5. render react circles
   */

  // initialize node and link data
  const nodes = state.mrca ? traverse_preorder(state.mrca) : [];
  const nodeNameToIndex: any = {};
  let forceLinks: SimulationLinkDatum<SimulationNodeDatum>[] = [];
  let forceNodes: SimulationNodeDatum[] = [];
  nodes.forEach((n: Node, i: number) => (nodeNameToIndex[n.name] = i));

  nodes.forEach((n: Node, i) => {
    if (!n.parent) {
      return;
    }
    const thisForceNode = {
      index: i,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      id: n.name,
    };
    forceNodes.push(thisForceNode);

    if (n.name === state.mrca.name) {
      return; // don't draw the branch leading into the mrca
    }
    const thisForceLinkToParent = {
      source: nodeNameToIndex[n.parent.name],
      target: nodeNameToIndex[n.name],
      distance: n.branch_attrs.length,
    };
    forceLinks.push(thisForceLinkToParent);
  });
  // console.log("forceNodes on init", forceNodes);

  const runSimulation = () => {
    // console.log("forceNodes in runSimulation", forceNodes);
    return d3
      .forceSimulation()
      .nodes(forceNodes)
      .force("link", d3.forceLink(forceLinks).distance(50).strength(20))
      .force("charge", d3.forceManyBody().strength(-20))
      .force(
        "center",
        d3.forceCenter(chartWidth / 2, chartHeight / 2).strength(100)
      );
  };

  let simulation = runSimulation();

  simulation.on("end", () => {
    console.log("nodes on simulation end", forceNodes);
    setPositionedNodes(forceNodes);
  });

  const addZoomCapabilities = () => {
    const container = d3.select(".container");
    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .translateExtent([
        [100, 100],
        [300, 300],
      ])
      .extent([
        [100, 100],
        [200, 200],
      ])
      .on("zoom", (event) => {
        let { x, y, k } = event.transform;
        x = 0;
        y = 0;
        k *= 1;
        container
          .attr("transform", `translate(${x}, ${y})scale(${k})`)
          .attr("width", chartWidth)
          .attr("height", chartHeight);
      });

    // @ts-ignore
    container.call(zoom);
  };

  const restartDrag = () => {
    if (simulation) simulation.alphaTarget(0.2).restart();
  };

  const stopDrag = () => {
    if (simulation) simulation.alphaTarget(0);
  };

  // drawTicks();
  addZoomCapabilities();

  return (
    <div>
      <svg
        className="container"
        x={0}
        y={0}
        width={chartWidth}
        height={chartHeight}
        transform={`translate(0, 0)scale(1)`}
      >
        <g>
          <DrawLinks forceLinks={forceLinks} />
          {positionedNodes && (
            <DrawNodes
              forceNodes={positionedNodes}
              restartDrag={restartDrag}
              stopDrag={stopDrag}
            />
          )}
          {/* <DrawLabels nodes={forceNodes} onNodeSelected={() => {}} /> */}
        </g>
      </svg>
    </div>
  );
};

export default DrawTree;
