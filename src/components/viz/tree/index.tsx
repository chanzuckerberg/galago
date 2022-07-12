import { useSelector } from "react-redux";
import { traverse_preorder } from "../../../utils/treeMethods";
import { Node, Point, D3Datum } from "../../../d";
import * as d3 from "d3";
import { Simulation, SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import { useEffect, useState } from "react";
import DrawLinks from "./drawLinks";
import DrawNodes from "./drawNodes";
import DrawLabels from "./drawLabels";

type DrawTreeProps = {
  chartHeight: number;
  chartWidth: number;
  chartMargin: number;
  onNodeSelected?: any;
};

export const DrawTree = (props: DrawTreeProps) => {
  const { chartHeight, chartWidth, chartMargin, onNodeSelected } = props;
  //@ts-ignore
  const state = useSelector((state) => state.global);

  const [positionedNodes, setPositionedNodes] = useState<SimulationNodeDatum[]>(
    []
  );

  // https://github.com/chanzuckerberg/ontology-ui/blob/main/src/components/OntologyExplorer/index.tsx#L128

  // initialize node and link data

  /**
   * 1. check for data
   * 2. create nodes and links
   * 3. pass them to the simulation
   * 4. wait for simulation to end -> set state with final data
   * 5. render react circles
   */

  useEffect(() => {
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

      forceLinks.push({
        source: nodeNameToIndex[n.parent.name],
        target: nodeNameToIndex[n.name],
        //@ts-ignore
        distance: n.branch_attrs.length,
      });

      const polytomyChildren = n.children.filter(
        (ch: Node) => ch.branch_attrs.length === 0
      );
      for (let i = 0; i < polytomyChildren.length - 1; i++) {
        // This is where you'll capture that last value
        for (let j = i + 1; j < polytomyChildren.length; j++) {
          forceLinks.push({
            source: nodeNameToIndex[polytomyChildren[i].name],
            target: nodeNameToIndex[polytomyChildren[j].name],
            //@ts-ignore
            distance: 0,
    });
        }
      }
    });

    const simulation = d3
      .forceSimulation()
      .nodes(forceNodes)
      .force("link", d3.forceLink(forceLinks).distance(50).strength(20))
      .force("charge", d3.forceManyBody().strength(-20));

    // let simulation = runSimulation();

    simulation.on("end", () => {
      console.log("nodes on simulation end", forceNodes, forceNodes[0].x);
      setPositionedNodes(forceNodes);
    });
  }, [state.mrca, state.tree]);

  return (
    <div>
      <svg
        style={{ border: "1px solid pink" }}
        width={chartWidth}
        height={chartHeight}
      >
        <g>
          {/* <DrawLinks forceLinks={forceLinks} /> */}
          {positionedNodes && <DrawNodes forceNodes={positionedNodes} />}
          {/* <DrawLabels nodes={forceNodes} onNodeSelected={() => {}} /> */}
        </g>
      </svg>
    </div>
  );
};

export default DrawTree;
