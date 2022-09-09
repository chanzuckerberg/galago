import { Node } from "../d";
import { getNodeAttr, get_dist, traverse_preorder } from "./treeMethods";

export const getColor = (
  node: Node,
  mrca: Node,
  mutsPerTransmissionMax: number,
  colorScale: [string, string, string]
) => {
  const distanceFromMrca = get_dist([node, mrca]);

  if (distanceFromMrca === 0) {
    return [colorScale[0], "white"];
  } else if (distanceFromMrca <= mutsPerTransmissionMax * 2) {
    return [colorScale[1], "white"];
  } else {
    return [colorScale[2], "black"];
  }
};

export const containsSamplesOfInterest = (
  node: Node,
  samplesOfInterestNames: string[]
) => {
  return (
    samplesOfInterestNames.includes(node.name) ||
    node.children.filter((child: Node) =>
      samplesOfInterestNames.includes(child.name)
    ).length > 0
  );
};

const polarToCartesian = (theta: number, radius: number) => {
  return { x: radius * Math.cos(theta), y: radius * Math.sin(theta) };
};

const getPolytomySize = (node: Node) => {
  // how many sample(s) should be represented by this node?
  // leaves take up space for themselves, unless they're part of a polytomy (in which case that space is already allocated to their parent).
  if (node.children.length === 0) {
    return node.branch_attrs.length === 0 ? 0 : 1;
  }
  // internal nodes get size allocated based on N direct descendent leaves with branch length 0
  return node.children.filter(
    (child: Node) =>
      child.children.length === 0 && child.branch_attrs.length === 0
  ).length;
};

const getTipCountForThetaAllocation = (node: Node) => {
  // how much angular space (i.e., theta) should this node take up?

  if (node.children.length === 0) {
    // leaves represent just themselves unless they're part of a polytomy (then they are already represented by their parent)
    return node.branch_attrs.length === 0 ? 0 : 1;
  } else {
    // nodes represent all the tips that descend from them, but the polytomy leaves are represented in circle size, not angular space
    return getNodeAttr(node, "tipCount") - getPolytomySize(node);
  }
};

const assignCoordinatesToChild = (
  childNode: Node,
  parentThetaAllocation: number,
  parentTipCount: number,
  thetaMin: number,
  mrcaDiv: number
) => {
  // WARNING: impure function, updates nodes in place.
  const nodeSize = getPolytomySize(childNode);
  const tipCount = getTipCountForThetaAllocation(childNode);

  const thetaAllocation =
    parentTipCount > 0
      ? (tipCount / parentTipCount) * parentThetaAllocation
      : 0;
  const thetaMax = thetaMin + thetaAllocation;
  const theta = thetaMin + (thetaMax - thetaMin) / 2;
  const radius = getNodeAttr(childNode, "div") - mrcaDiv;
  const { x, y } = polarToCartesian(theta, radius);

  // update node attrs with coordinates
  childNode.node_attrs = {
    ...childNode.node_attrs,
    thetaMin,
    thetaMax,
    theta,
    radius,
    x,
    y,
    nodeSize,
  };
};

const updateMinMaxValues = (
  node: Node,
  vals: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    maxSize: number;
  }
) => {
  // update min / max coordinates for svg scaling later
  const x = getNodeAttr(node, "x");
  const y = getNodeAttr(node, "y");
  const nodeSize = getNodeAttr(node, "nodeSize");

  vals["minX"] = x && x < vals["minX"] ? x : vals["minX"];
  vals["maxX"] = x && x > vals["maxX"] ? x : vals["maxX"];
  vals["minY"] = y && y < vals["minY"] ? y : vals["minY"];
  vals["maxY"] = y && y > vals["maxY"] ? y : vals["maxY"];
  vals["maxSize"] = nodeSize > vals["maxSize"] ? nodeSize : vals["maxSize"];

  return vals;
};

export const initializeEqualAnglePolarCoordinates = (mrca: Node) => {
  const orderedNodes = traverse_preorder(mrca); // traverse through each parent node before its children
  const mrcaDiv = getNodeAttr(mrca, "div"); // used as 'zero' for radius

  let parentThetaMin, parentThetaMax, parentThetaAllocation;
  let minMaxValues = { minX: 0, maxX: 0, minY: 0, maxY: 0, maxSize: 0 };

  orderedNodes.forEach((parentNode: Node) => {
    // leaves have their coordinates assigned when we visit their parents, no need to visit directly
    if (parentNode.children.length > 0) {
      if (!parentNode.parent || parentNode === mrca) {
        /*
    Initialize root of the (sub)tree directly with starting values
    After this initialization we only look forward / alter the child nodes at each step
    */
        parentThetaMin = 0;
        parentThetaMax = 2 * Math.PI;
        parentThetaAllocation = parentThetaMax - parentThetaMin;
        const nodeSize = getPolytomySize(parentNode);

        parentNode.node_attrs = {
          ...parentNode.node_attrs,
          thetaMin: parentThetaMin,
          thetaMax: parentThetaMax,
          theta: Math.PI,
          radius: 0,
          x: 0,
          y: 0,
          nodeSize,
        };

        minMaxValues = updateMinMaxValues(parentNode, minMaxValues);
      } else {
        /* Then, for each internal node in the tree, pull its pre-assigned coordinates*/
        parentThetaMin = getNodeAttr(parentNode, "thetaMin");
        parentThetaMax = getNodeAttr(parentNode, "thetaMax");
        parentThetaAllocation = parentThetaMax - parentThetaMin;
      }
      /* Whether the current `parentNode` we're iterating over is the root or an internal node, assign coordinates to each of its direct descendents.*/
      const parentTipCount = getTipCountForThetaAllocation(parentNode);

      let thetaMin = parentThetaMin;
      for (let i = 0; i < parentNode.children.length; i++) {
        const childNode = parentNode.children[i];
        const childTipCount = getTipCountForThetaAllocation(childNode);

        assignCoordinatesToChild(
          childNode,
          parentThetaAllocation,
          parentTipCount,
          thetaMin,
          mrcaDiv
        );

        thetaMin +=
          getNodeAttr(childNode, "thetaMax") -
          getNodeAttr(childNode, "thetaMin");

        minMaxValues = updateMinMaxValues(childNode, minMaxValues);
      }
    } else {
    }
  });
  return minMaxValues;
};
