import { Node } from "../d";
import {
  get_leaves,
  get_state_changes,
  traverse_preorder,
  get_path,
} from "./treeMethods";
import { useSelector } from "react-redux";
import { setIntersection } from "./misc";

export const trimDeepNodes = (tree: Node, maxDescendents?: number) => {
  maxDescendents ??= get_leaves(tree).length / 10;

  const shallow_nodes = traverse_preorder(
    tree,
    //@ts-ignore -- we safeguard against null maxDescendent values in line above
    (n: Node) => get_leaves(n).length < maxDescendents
  );
  return shallow_nodes;
};

export const nextstrainGeo = (tree: Node, trait: string = "location") => {
  return get_state_changes(tree, trait);
};

export const getSamplesOfInterestMrcas = (nodes: Node[], root: Node) => {
  let all_mrca_options: Array<Node> = [];
  let seen_node_names: string[] = [];

  for (let i = 0; i < nodes.length; i++) {
    let this_path = get_path([root, nodes[i]]).path.filter(
      (n) => n.children.length > 0
    );

    this_path.forEach((n: Node) => {
      if (!seen_node_names.includes(n.name)) {
        seen_node_names.push(n.name);
        all_mrca_options.push(n);
      }
    });
  }

  return all_mrca_options;
};

export const handleSamplesOfInterestAndClusteringIntersection = (
  samplesOfInterest: Node[],
  clusterMrcaOptions: Node[],
  tree: Node
) => {
  const state = useSelector((state) => state.global);
  const samplesOfInterestMrcas = getSamplesOfInterestMrcas(
    samplesOfInterest,
    tree
  );

  if (!clusterMrcaOptions && !samplesOfInterestMrcas) {
    return [];
  } else if (!clusterMrcaOptions) {
    return samplesOfInterestMrcas;
  } else if (!samplesOfInterestMrcas) {
    return clusterMrcaOptions;
  }

  let newMrcaOptions: Node[] = [];
  const samplesOfInterestNamesSet = new Set(
    state.samplesOfInterest.map((n: Node) => n.name)
  );

  clusterMrcaOptions.forEach((n: Node) => {
    let leaves = get_leaves(n).map((n) => n.name);
    if (setIntersection(new Set(leaves), samplesOfInterestNamesSet).size > 0) {
      newMrcaOptions.push(n);
    }
  });

  console.assert(
    newMrcaOptions.length > 0,
    "NO CLUSTERS CONTAIN ANY SAMPLES OF INTEREST!?"
  );
  return newMrcaOptions;
};
