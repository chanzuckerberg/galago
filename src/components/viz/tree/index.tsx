import { useSelector } from "react-redux";
import { get_dist, traverse_preorder } from "../../../utils/treeMethods";
import { Node, forceNode, forceLink } from "../../../d";
import * as d3 from "d3";
import { useEffect, useState } from "react";
import DrawForceLink from "./drawForceLink";
import DrawNodes from "./drawNodes";
import DrawLabels from "./drawLabels";
import DrawHull from "./drawHull";

type DrawTreeProps = {
  chartHeight: number;
  chartWidth: number;
  chartMargin: number;
  onNodeSelected?: any;
};

export const DrawTree = (props: DrawTreeProps) => {
  const { chartHeight, chartWidth, chartMargin, onNodeSelected } = props;
  /** Initialize state */
  //@ts-ignore
  const state = useSelector((state) => state.global);

  // links and nodes that d3 has finished finding positions for
  const [positionedNodes, setPositionedNodes] = useState<forceNode[]>([]);
  const [positionedLinks, setPositionedLinks] = useState<forceLink[]>([]);
  const [positionedPolytomies, setPositionedPolytomies] = useState<
    Array<forceNode[]>
  >([]);

  const initForceNode = (n: Node, i: number) => {};

  const initData = () => {
    /** Traverses the subtree and initializes the forceNodes, forceLinks, and polytomies (used for drawing hulls) */
    const nodes: Node[] = state.mrca ? traverse_preorder(state.mrca) : []; // tree nodes
    const nodeNameToIndex: any = {};
    nodes.forEach((n: Node, i: number) => (nodeNameToIndex[n.name] = i));

    let forceLinks: forceLink[] = [];
    let forceNodes: forceNode[] = []; // MUTABLE by D3: minimal objects for the force layout to use
    let polytomiesIdx: Array<number[]> = [];

    const checkIfPolytomy = (node: Node) => {
      if (node.children.length === 0 && node.branch_attrs.length === 0) {
        return true;
      } else if (
        node.children.filter((ch: Node) => ch.branch_attrs.length === 0)
          .length > 0
      ) {
        return true;
      } else {
        return false;
      }
    };

    /** initialize forceNodes */
    nodes.forEach((n: Node, i) => {
      if (!n.parent) {
        // don't try to draw the root of the tree, it's not a real node.
        return;
      }

      const thisForceNode: forceNode = {
        index: i,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        id: n.name,
        mrcaDist: get_dist([n, state.mrca]), // distance from the mrca of the selected clade; used for coloring
        isLeaf: n.children.length === 0,
        isPolytomy: checkIfPolytomy(n),
      };
      forceNodes.push(thisForceNode);

      /** initialize forceLinks */
      if (n.name === state.mrca.name) {
        return; // don't draw the branch leading into the mrca
      }

      forceLinks.push({
        source: nodeNameToIndex[n.parent.name],
        target: nodeNameToIndex[n.name],
        //@ts-ignore
        distance: n.branch_attrs.length,
      });

      /** catalog polytomies */
      /**
       * A polytomy is an internal node of the tree with many samples (leaves) as children which are all identical to the internal node -- that is, they have 0 branch length and thus form a tight cluster.
       * We want to reinforce this tight clustering in a few ways downstream, so we need to keep track of which polytomies exist.
       * We catalog each polytomy as an array of the internal node and all of its identical children.
       * Because the forceNode objects will be modified by the d3 simulation, we store these as indices of the forceNode * array that we can then access later once the simulation is complete.
       */
      const polytomyChildrenNames = n.children
        .filter((ch: Node) => ch.branch_attrs.length === 0)
        .map((ch: Node) => ch.name);

      if (polytomyChildrenNames.length > 1) {
        // TODO: should we also draw mini "hulls" as internal nodes?
        let polytomyIdx = polytomyChildrenNames.map(
          (name: string) => nodeNameToIndex[name]
        );
        polytomyIdx.push(i); // current node index
        polytomiesIdx.push(polytomyIdx);
      }

      for (let i = 0; i < polytomyChildrenNames.length - 1; i++) {
        for (let j = i + 1; j < polytomyChildrenNames.length; j++) {
          forceLinks.push({
            source: nodeNameToIndex[polytomyChildrenNames[i]],
            target: nodeNameToIndex[polytomyChildrenNames[j]],
            distance: 0,
          });
        }
      }
    });
    return {
      forceNodes: forceNodes,
      forceLinks: forceLinks,
      polytomiesIdx: polytomiesIdx,
      nodes: nodes,
    };
  };

  const polytomiesIdxToForceNode = (
    polytomiesIdx: Array<number[]>,
    forceNodes: forceNode[]
  ) => {
    //* once the force nodes have been positioned by d3, we can swap out our index-based records for the actual forceNode objects */
    let translatedPolytomies: Array<forceNode[]> = [];

    polytomiesIdx.forEach((pti: number[]) => {
      let translatedPolytomy = pti.map((idx: number) => forceNodes[idx]);
      translatedPolytomies.push(translatedPolytomy);
    });

    return translatedPolytomies;
  };

  const initSimulation = (
    forceNodes: forceNode[],
    forceLinks: forceLink[],
    distanceMultiplier: number
  ) => {
    const simulation = d3
      .forceSimulation()
      .nodes(forceNodes)
      .force(
        "link", // tries to arrange linked nodes so the distances between them is respected
        d3
          .forceLink(forceLinks)
          /** the distance multiplier exaggerates the difference between
           * 0-branch length links (i.e., polytomies) and links that correspond to actual mutations  */
          .distance((d: forceLink) => d.distance * distanceMultiplier)
          .strength(1)
      )
      .force(
        // nodes repel each other / fan out
        "charge",
        d3
          .forceManyBody()
          // @ts-ignore - somehow it still can't figure out that forceNode extends NodeSimulationDatum
          .strength((d: forceNode) => (d.isPolytomy ? -25 : -100))
          .distanceMin(0)
        // .distanceMax((maxDist * distanceMultiplier) / 2)
      )
      // fka 'gravity' - nodes close to the center are only slightly affected, nodes farther away are pulled inwards with progressively increasing force
      .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
      // don't overlap nodes with each other
      .force(
        "collision",
        //@ts-ignore
        d3.forceCollide().radius((d: forceNode) => (d.isLeaf ? 7 : 0))
      );

    return simulation;
  };

  // only run the simulation (once) if the tree or the mrca is changed
  useEffect(() => {
    const { forceNodes, forceLinks, polytomiesIdx, nodes } = initData();

    const maxDist =
      nodes.slice(-1)[0].node_attrs.div - state.mrca.node_attrs.div;
    const distanceMultiplier = chartWidth / (1.5 * maxDist);

    const simulation = initSimulation(
      forceNodes,
      forceLinks,
      distanceMultiplier
    );

    // wait until positions are assigned before updating the svg
    simulation.on("end", () => {
      setPositionedNodes(forceNodes);
      setPositionedLinks(forceLinks);
      setPositionedPolytomies(
        polytomiesIdxToForceNode(polytomiesIdx, forceNodes)
      );
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
        {positionedNodes && <DrawNodes forceNodes={positionedNodes} />}
        {/* <DrawLabels nodes={forceNodes} onNodeSelected={() => {}} /> */}
      </svg>
    </div>
  );
};

export default DrawTree;
