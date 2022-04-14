import { Node } from "../d";
import {
  get_leaves,
  get_state_changes,
  traverse_preorder,
  get_path,
} from "./treeMethods";

export const trimDeepNodes = (tree: Node, maxDescendents?: number) => {
  maxDescendents ??= get_leaves(tree).length / 10;

  const allInternalNodes = traverse_preorder(tree).filter(
    (node: Node) => node.children.length >= 2
  );

  let shallow_nodes = [];
  let seen_nodes: string[] = [];
  for (let i = 0; i < allInternalNodes.length; i++) {
    let currentNode = allInternalNodes[i];
    if (get_leaves(currentNode).length < maxDescendents) {
      if (!seen_nodes.includes(currentNode.name)) {
        seen_nodes.push(currentNode.name);
        shallow_nodes.push(currentNode);
      }
    }
  }
  return shallow_nodes;
};

export const nextstrainGeo = (tree: Node, trait: string = "location") => {
  return get_state_changes(tree, trait);
};

export const getMrcaOptions = (
  tree: Node,
  samplesOfInterest: Node[],
  clusteringMrcas: Node[]
) => {
  // no conditions? return all internal nodes with >=2 descendents
  if (
    (!clusteringMrcas || clusteringMrcas.length === 0) &&
    (!samplesOfInterest || samplesOfInterest?.length === 0)
  ) {
    console.log("setting mrca options to all internal nodes");
    return traverse_preorder(tree).filter((n: Node) => n.children.length >= 2);
    // clustering results but no samples of interest? just return clustering results
  } else if (!samplesOfInterest || samplesOfInterest.length === 0) {
    return clusteringMrcas;
  }

  /* trace from each sample of interest to the root to find 
   all internal nodes with >= 1 descendent of interest */
  const samplesOfInterestMrcas: Array<Node> = [];
  let seen_node_names: string[] = []; // avoid duplications

  for (let i = 0; i < samplesOfInterest.length; i++) {
    let this_path = get_path([tree, samplesOfInterest[i]]).path.filter(
      (n) => n.children.length > 0
    );

    this_path.forEach((n: Node) => {
      if (!seen_node_names.includes(n.name)) {
        seen_node_names.push(n.name);
        samplesOfInterestMrcas.push(n);
      }
    });
  }

  // no clustering constraints? just return samples of interest mrcas
  if (!clusteringMrcas || clusteringMrcas.length === 0) {
    return samplesOfInterestMrcas;
  }

  const samplesOfInterestMrcaNames = samplesOfInterestMrcas.map(
    (mrca: Node) => mrca.name
  );
  const intersectMrcaOptions = clusteringMrcas.filter((mrca: Node) =>
    samplesOfInterestMrcaNames.includes(mrca.name)
  );

  console.log(
    "all internal nodes",
    traverse_preorder(tree).filter((n: Node) => n.children.length >= 2).length,
    "\nsample of interest mrcas",
    samplesOfInterestMrcas.length,
    "\nclustering mrcas",
    clusteringMrcas.length,
    "\nintersection - new mrcas",
    intersectMrcaOptions.length
  );

  return intersectMrcaOptions;
};
