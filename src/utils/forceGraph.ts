import * as d3 from "d3";
import { forceLink, forceNode, Node } from "../d";
import { traverse_preorder, get_dist } from "./treeMethods";

const checkIfPolytomy = (n: Node) => {
  if (n.children.length === 0 && n.branch_attrs.length === 0) {
    return true;
  } else if (
    n.children.filter((ch) => ch.branch_attrs.length === 0).length > 0
  ) {
    return true;
  }
  return false;
};

export const initForceGraphData = (mrca: Node) => {
  //@ts-ignore

  /** Traverses the subtree and initializes the forceNodes, forceLinks, and polytomies (used for drawing hulls) */
  const nodes: Node[] = mrca ? traverse_preorder(mrca) : []; // tree nodes
  const nodeNameToIndex: any = {};
  nodes.forEach((n: Node, i: number) => (nodeNameToIndex[n.name] = i));

  let forceLinks: forceLink[] = [];
  let forceNodes: forceNode[] = []; // MUTABLE by D3: minimal objects for the force layout to use

  /** initialize forceNodes */
  nodes.forEach((n: Node, i) => {
    const thisForceNode: forceNode = {
      index: i,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      id: n.name,
      mrcaDist: get_dist([n, mrca]), // distance from the mrca of the selected clade; used for coloring
      isLeaf: n.children.length === 0,
      isPolytomy: checkIfPolytomy(n),
    };
    forceNodes.push(thisForceNode);

    /** initialize forceLinks */
    if (n.name === mrca.name) {
      return; // don't draw the branch leading into the mrca
    }

    if (n.parent) {
      forceLinks.push({
        source: nodeNameToIndex[n.parent.name],
        target: nodeNameToIndex[n.name],
        //@ts-ignore
        distance: n.branch_attrs.length,
      });
    }

    /** catalog polytomies */
    /**
     * A polytomy is an internal node of the tree with many samples (leaves) as children which are all identical to the internal node -- that is, they have 0 branch length and thus form a tight cluster.
     * We want to reinforce this tight clustering by drawing invisible 0-length cross-links between them.
     */
    const polytomyChildrenNames = n.children
      .filter((ch: Node) => ch.branch_attrs.length === 0)
      .map((ch: Node) => ch.name);

    // for (let i = 0; i < polytomyChildrenNames.length - 1; i++) {
    //   for (let j = i + 1; j < polytomyChildrenNames.length; j++) {
    //     forceLinks.push({
    //       source: nodeNameToIndex[polytomyChildrenNames[i]],
    //       target: nodeNameToIndex[polytomyChildrenNames[j]],
    //       distance: 0,
    //     });
    // }
    // }
  });
  return {
    forceNodes: forceNodes,
    forceLinks: forceLinks,
    nodes: nodes,
  };
};

export const initSimulation = (
  forceNodes: forceNode[],
  forceLinks: forceLink[],
  distanceMultiplier: number,
  chartWidth: number,
  chartHeight: number
) => {
  const radius = Math.max(
    Math.min(chartHeight / (0.8 * forceNodes.length), 25),
    2
  );

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
        .strength((d: forceNode) => {
          if (!d.isPolytomy) {
            return -30 * (forceNodes.length / 10);
          } else if (d.isPolytomy && !d.isLeaf) {
            return +1;
          } else {
            // polytomy leaves
            return -1 * (forceNodes.length / 10);
          }
        })
        .distanceMin(0)
    )
    // fka 'gravity' - nodes close to the center are only slightly affected, nodes farther away are pulled inwards with progressively increasing force
    .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
    // don't overlap nodes with each other
    .force(
      "collision",
      //@ts-ignore
      d3.forceCollide().radius((d: forceNode) => {
        if (!d.isLeaf) {
          // internal nodes
          return 0;
        } else if (!d.isPolytomy) {
          // standalone nodes
          return radius;
        } else {
          // polytomy leaves
          return radius * 0.5;
        }
      })
    );

  return simulation;
};
