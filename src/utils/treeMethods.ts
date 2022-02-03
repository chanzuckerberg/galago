import { NSNode } from "./nextstrainAdapter";
import { Node } from "../d";

export const traverse_preorder = (
  node: Node,
  apply_fn?: Function,
  collect_condition?: Function,
  traverse_condition?: Function,
  collection: Node[] = []
) => {
  // first visit the node, maybe do something
  if (apply_fn) {
    apply_fn(node);
  }

  if (!collect_condition || collect_condition(node)) {
    collection.push(node); // make a note that we've seen this node
  }
  // then visit children, left to right
  if (node.children.length > 0) {
    const children_to_visit = traverse_condition
      ? node.children.filter((n) => traverse_condition(n))
      : node.children;
    for (let i = 0; i < children_to_visit.length; i++) {
      collection = traverse_preorder(
        children_to_visit[i],
        apply_fn,
        collect_condition,
        traverse_condition,
        collection
      );
    }
  }

  return collection;
};

// export const traverse_postorder = (
//   node: Node,
//   node_fn?: Function,
//   collection: Node[] = []
// ) => {
//   // visit children first, left to rigt
//   if (node.children.length > 0) {
//     for (var i = 0; i < node.children.length; i++) {
//       collection = traverse_postorder(node.children[i], node_fn, collection);
//     }
//   }

//   if (node_fn) {
//     // then visit current node and do something
//     node_fn(node);
//   }
//   collection.push(node);
//   return collection;
// };

export const get_mrca = (target_nodes: Node[]) => {
  // if only one node given, return itself
  if (new Set(target_nodes).size === 1) {
    return target_nodes[0];
  }

  if (target_nodes.length <= 1) {
    return console.assert(
      target_nodes.length > 1,
      "No nodes passed to mrca function!"
    );
  }
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
  return console.error(
    "Nodes are not part of a contiguous tree structure! Cannot find mrca."
  );
};

export const get_path = (target_nodes: Node[]) => {
  console.assert(new Set(target_nodes).size === 2);

  const mrca: Node | void = get_mrca(target_nodes);
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

export const get_dist = (target_nodes: Node[]) => {
  console.assert(target_nodes.length === 2, target_nodes);

  const mp = get_path(target_nodes); // HELP: review of how to unpack things in js....
  const mrca = mp["mrca"];
  const path = mp["path"];
  let dist = 0;

  for (let i = 0; i < path.length; i++) {
    if (path[i] === mrca) {
      continue; // the branch_length attribute is always the branch leading *into* the node. the mrca's distance to parent is not relevant.
    }
    dist = dist + path[i].branch_attrs.length;
  }
  return dist;
};

export const get_pairwise_distances = (target_nodes: Node[]) => {
  let pairwise_dist: Array<{ nodes: Array<Node>; dist: number }> = [];

  for (let i = 0; i < target_nodes.length - 1; i++) {
    for (let j = i + 1; j < target_nodes.length; j++) {
      let pair = [target_nodes[i], target_nodes[j]];
      let result = { nodes: pair, dist: get_dist(pair) };
      pairwise_dist.push(result);
    }
  }

  return pairwise_dist;
};

export const get_parent_for_cousins = (node: Node, min_muts: number = 1) => {
  if (!node.parent) {
    return node;
  }
  let accumulated_dist: number = node.branch_attrs.length;
  let parent_candidate: Node = node.parent;
  while (parent_candidate.parent && accumulated_dist < min_muts) {
    accumulated_dist = accumulated_dist + parent_candidate.branch_attrs.length;
    parent_candidate = parent_candidate.parent;
  }
  return parent_candidate;
};

export const get_leaves = (mrca: Node) => {
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
  let current_node = node;
  while (node.parent) {
    current_node = node.parent;
  }
  return node;
};

export const get_state_changes = (tree: Node, trait: string) => {};
