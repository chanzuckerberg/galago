import { NSNode } from "./nextstrainAdapter";
import { Node } from "../d";

export const traverse_preorder = (
  node: Node,
  collect_condition?: Function,
  traverse_condition?: Function,
  collection: Node[] = []
) => {
  // recursively traverse the tree, breadth first

  // first visit this node and make a note that we've seen it
  if (!collect_condition || collect_condition(node)) {
    collection.push(node);
  }

  // then visit children, left to right
  if (node.children.length > 0) {
    const children_to_visit = traverse_condition
      ? node.children.filter((n) => traverse_condition(n))
      : node.children;
    for (let i = 0; i < children_to_visit.length; i++) {
      collection = traverse_preorder(
        children_to_visit[i],
        // apply_fn,
        collect_condition,
        traverse_condition,
        collection
      );
    }
  }
  return collection;
};

export const traverse_postorder = (
  node: Node,
  collect_condition?: Function,
  traverse_condition?: Function,
  collection: Node[] = []
) => {
  // recursively traverse the tree, depth-first

  // first visit children, left to right
  if (node.children.length > 0) {
    const children_to_visit = traverse_condition
      ? node.children.filter((n) => traverse_condition(n))
      : node.children;
    for (let i = 0; i < children_to_visit.length; i++) {
      collection = traverse_preorder(
        children_to_visit[i],
        collect_condition,
        traverse_condition,
        collection
      );
    }
  }

  // then visit this node and make a note that we've seen it
  if (!collect_condition || collect_condition(node)) {
    collection.push(node);
  }

  return collection;
};

export const get_mrca = (target_nodes: Node[]) => {
  // if only one node given, return itself
  if (new Set(target_nodes).size === 1) {
    return target_nodes[0];
  }

  console.assert(target_nodes.length > 1, "No nodes passed to mrca function!");

  // iterate over target nodes and record the path between this node and the root of the tree
  var paths: Array<Array<Node>> = [];
  for (let i = 0; i < target_nodes.length; i++) {
    let current_node: Node = target_nodes[i];
    let this_path: Array<Node> = [];

    while (current_node) {
      // while we haven't yet reached the root, record each great-great-/great-/grand-/parent
      this_path.push(current_node);
      if (current_node.parent) {
        // move up to the parent (the root has no parent)
        current_node = current_node.parent;
      } else {
        // if we reach the root (whose parent = null or undefined), break the loop and move to the next node
        break;
      }
    }
    paths.push(this_path); // add this path to the list of node paths
  }

  // the mrca must be contained in every path between each target node and the root. use the first one as a reference to compare to.
  let reference_path: Array<Node> = paths[0] ? paths[0] : [];
  for (let i = 0; i < reference_path.length; i++) {
    let current_candidate_node: Node = reference_path[i];
    let still_a_candidate: boolean = true;
    for (let i = 1; i < paths.length; i++) {
      // iterate through the paths between each subsequent target node and the root of the tree
      let current_path: Array<Node> = paths[i];

      // if the current candidate node is not present in any path, it's not the mrca -- move on
      if (!current_path.includes(current_candidate_node)) {
        still_a_candidate = false;
        break;
      }

      // because nodes are added to each path in order from most recent -> most ancestral, the first time we encounter a node that is in every path, we've found the mrca
      if (still_a_candidate) {
        const mrca: Node = current_candidate_node;
        return mrca;
      }
    }
  }
  console.error(
    "Nodes are not part of a contiguous tree structure! Cannot find mrca."
  );

  return get_root(target_nodes[0]);
};

export const get_path = (target_nodes: Node[]) => {
  console.assert(new Set(target_nodes).size === 2, target_nodes);

  const mrca: Node = get_mrca(target_nodes);
  if (!mrca) {
    console.error("No MRCA found! Cannot get path");
  }

  let path1: Node[] = [];
  let path2: Node[] = [];
  let current_node: Node = target_nodes[0];

  while (current_node !== mrca && current_node.parent) {
    path1.push(current_node);
    current_node = current_node.parent;
  }

  if (mrca) {
    path1.push(mrca);
    current_node = target_nodes[1];
  }
  while (current_node !== mrca && current_node.parent) {
    path2.push(current_node);
    current_node = current_node.parent;
  }
  return { mrca: mrca, path: path1.concat(path2.reverse()) };
};

export const get_dist = (target_nodes: [Node, Node]) => {
  if (target_nodes[0].name === target_nodes[1].name) {
    return 0;
  }
  const mp = get_path(target_nodes);
  const mrca = mp["mrca"];
  const path = mp["path"];
  let dist = 0;

  for (let i = 0; i < path.length; i++) {
    if (
      path[i] === mrca || // TODO: FIX THIX PROPERLY -- ROOT *SHOULD* BE RETURNED AS MRCA AND THEREFORE SKIPPED
      [NaN, null, undefined].includes(path[i].branch_attrs.length)
    ) {
      continue; // the branch_length attribute is always the branch leading *into* the node. the mrca's distance to parent is not relevant.
    }
    dist = dist + path[i].branch_attrs.length;
  }
  return dist;
};

export const calcPairwiseDistances = (target_nodes: Node[]) => {
  // pairwise patristic distances; brute force implementation

  let pairwise_dist: Array<{
    strain: string;
    distances: Array<{ strain: string; dist: number }>;
  }> = [];

  for (let i = 0; i < target_nodes.length - 1; i++) {
    let distances_from_strain_i: {
      strain: string;
      distances: Array<{ strain: string; dist: number }>;
    } = {
      strain: target_nodes[i].name,
      distances: [],
    };
    for (let j = i + 1; j < target_nodes.length; j++) {
      let dist_ij = {
        strain: target_nodes[j].name,
        dist: get_dist([target_nodes[i], target_nodes[j]]),
      };
      distances_from_strain_i["distances"].push(dist_ij);
    }
    pairwise_dist.push(distances_from_strain_i);
  }

  return pairwise_dist;
};

export const get_parent_for_cousins = (node: Node, min_muts: number = 1) => {
  // get the parent node we want to use for reporting on "cousins," subject to the constraint that we want to keep looking deeper in the tree until we've gone at least X mutations back / are looking broadly enough

  if (!node.parent) {
    return node;
  }
  let children = node.children;
  let n_cousins = 0;
  let accumulated_dist: number = node.branch_attrs.length;
  let parent_candidate: Node = node.parent;
  while (
    parent_candidate.parent &&
    (accumulated_dist < min_muts || n_cousins < 1)
  ) {
    accumulated_dist = accumulated_dist + parent_candidate.branch_attrs.length;
    n_cousins = get_leaves(parent_candidate).filter(
      (n) => !children.includes(n)
    ).length;
    parent_candidate = parent_candidate.parent;
  }
  return parent_candidate;
};

export const get_leaves = (mrca: Node) => {
  // get all terminal nodes in the tree

  const all_children: Array<Node> = traverse_preorder(mrca);
  let leaves: Node[] = [];
  for (let i = 0; i < all_children.length; i++) {
    if (all_children[i].children.length === 0) {
      leaves.push(all_children[i]);
    }
  }
  return leaves;
};

export const get_root = (node: Node) => {
  // return the root node of the tree (i.e., the first one without a parent)

  let current_node = node;
  while (node.parent) {
    current_node = node.parent;
  }
  return node;
};

export const find_leaf_by_name = (name: string, all_samples: Node[]) => {
  for (let i = 0; i < all_samples.length; i++) {
    if (all_samples[i].name === name) {
      return all_samples[i];
    }
  }
  return null;
};

export const getNodeAttr = (
  n: Node,
  attr: string,
  type:
    | "value"
    | "confidence"
    | "matutils_confidence"
    | "matutils_value" = "value"
) => {
  // various types of values are stored in a number of different structures in nextstrain jsons; helper accessor / helper function to look all the different places and return the value

  let attrValue: any = undefined;

  // attribute present
  if (Object.keys(n.node_attrs).includes(attr)) {
    // if attribute is a dictionary, require the `type` key
    if (
      Object.prototype.toString.call(n.node_attrs[attr]) ===
        "[object Object]" &&
      Object.keys(n.node_attrs[attr]).includes(type)
    ) {
      attrValue = n.node_attrs[attr][type];
    }
    // only nextstrain attribute `values` come in as non-dictionaries
    else if (
      Object.prototype.toString.call(n.node_attrs[attr]) !== "[object Object]"
    ) {
      attrValue = n.node_attrs[attr];
    }
  }

  // if attrValue we found was falsey or a filler, return undefined for uniformity
  if ([NaN, null, undefined, "unknown", ""].includes(attrValue)) {
    return undefined;
  } else {
    return attrValue;
  }
};

const doesTraitMatchParent = (
  node: Node,
  trait_to_check: string,
  method: "nextstrain" | "matutils" = "nextstrain"
) => {
  // deal with root
  if (!node.parent) {
    // root is not a breakpoint
    return true;
  }

  const node_trait_value = getNodeAttr(
    node,
    trait_to_check,
    method === "nextstrain" ? "value" : "matutils_value"
  );
  const parent_trait_value = getNodeAttr(
    node.parent,
    trait_to_check,
    method === "nextstrain" ? "value" : "matutils_value"
  );
  return node_trait_value === parent_trait_value;
};

export const getAttrChanges = (
  startNode: Node,
  attr: string,
  method: "nextstrain" | "matutils" = "nextstrain"
) => {
  const allNodes: Array<Node> = traverse_preorder(startNode);

  const breakPoints = allNodes.filter(
    (n) => !doesTraitMatchParent(n, attr, method) && n.children.length >= 2
  );

  return breakPoints;
};

export const describeTree = (node: Node, get_root_first: boolean = false) => {
  if (get_root_first) {
    node = get_root(node);
  }
  const all_objects = traverse_preorder(node);
  const leaves = all_objects.filter((o) => o.children.length == 0);
  const height = leaves
    .sort((a, b) => a.node_attrs.div - b.node_attrs.div)
    .slice(-1)[0].node_attrs.div;
  console.log(
    "loaded tree and found:",
    "total nodes",
    all_objects.length,
    "total leaves",
    leaves.length,
    "max divergence",
    height
  );
};

export const assignTipCount = (tree: Node) => {
  // WARNING: IMPURE FUNCTION

  const allNodes = traverse_postorder(tree).reverse();

  allNodes.forEach((n: Node) => {
    if (n.children.length === 0) {
      n.node_attrs.tipCount = 0;
    } else {
      let currentNodeTipCount = 0;
      for (let i = 0; i < n.children.length; i++) {
        let child = n.children[i];
        if (child.children.length === 0) {
          currentNodeTipCount += 1;
        } else {
          currentNodeTipCount += child.node_attrs.tipCount;
        }
      }
      n.node_attrs.tipCount = currentNodeTipCount;
    }
  });
};
