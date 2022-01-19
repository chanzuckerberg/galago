import { NSNode } from "./nextstrainAdapter";

export const branch_length_from_div = (node: NSNode) => {
  if (node.parent) {
    node.branch_attrs["length"] =
      node.node_attrs["div"] - node.parent.node_attrs["div"];
  }
};

export const traverse_preorder = (
  node: NSNode,
  node_fn?: Function,
  parent?: NSNode
) => {
  if (parent) {
    // visit current node first. while we're at it, make sure we have pointers to parents on all our nodes
    node.parent = parent;
  }

  if (node_fn) {
    // do something
    node_fn(node);
  }

  if (
    node.children !== undefined &&
    Array.isArray(node.children) &&
    node.children.length > 0
  ) {
    // then visit children, left to right
    for (var i = 0; i < node.children.length; i++) {
      traverse_preorder(
        (node = node.children[i]),
        (node_fn = node_fn),
        (parent = node)
      );
    }
  }

  return node;
};

export const traverse_postorder = (node: NSNode, node_fn?: Function) => {
  if (node.children) {
    // visit children first, left to rigt
    for (var i = 0; i < node.children.length; i++) {
      traverse_postorder((node = node.children[i]), (node_fn = node_fn));
    }
  }

  if (node_fn) {
    // then visit current node and do something
    node_fn(node);
  }
  return node;
};

export const get_mrca = (target_nodes: NSNode[]) => {
  // if only one node given, return itself
  if (new Set(target_nodes).size === 1) {
    return target_nodes[0];
  }

  // iterate over target nodes and record the path between this node and the root of the tree
  var paths: Array<Array<NSNode>> = [];
  for (let i = 0; i < target_nodes.length; i++) {
    let current_node: NSNode | null = target_nodes[i];
    let this_path: Array<NSNode> = [];

    while (current_node) {
      // while we haven't yet reached the root, record each great-great-/great-/grand-/parent
      this_path.push(current_node);
      if (current_node.parent) {
        // move up to the parent (the root has no parent)
        current_node = current_node.parent;
      } else {
        // if we reach the root, break the loop and reset the current_node pointer
        current_node = null;
      }
    }
    paths.push(this_path); // add this path to the list of node paths
  }

  // the mrca must be contained in every path between each target node and the root. use the first one as a reference to compare to.
  let reference_path: Array<NSNode> = paths[0];
  for (let i = 0; i < reference_path.length; i++) {
    let current_candidate_node: NSNode = reference_path[i];
    let still_a_candidate: boolean = true;
    for (let i = 1; i < paths.length; i++) {
      // iterate through the paths between each subsequent target node and the root of the tree
      let current_path: Array<NSNode> = paths[i];

      // if the current candidate node is not present in any path, it's not the mrca -- move on
      if (!current_path.includes(current_candidate_node)) {
        still_a_candidate = false;
        break;
      }

      // because nodes are added to each path in order from most recent -> most ancestral, the first time we encounter a node that is in every path, we've found the mrca
      if (still_a_candidate) {
        const mrca: NSNode = current_candidate_node;
        return mrca;
      }
    }
  }
};

export const get_dist = (target_nodes: NSNode[]) => {
  console.assert(target_nodes.length === 2, target_nodes);

  const mrca = get_mrca(target_nodes);
  console.assert(mrca !== undefined);
  const node1_to_mrca: number =
    target_nodes[0].node_attrs.div - mrca.node_attrs.div;
  const node2_to_mrca: number =
    target_nodes[1].node_attrs.div - mrca.node_attrs.div;
  return node1_to_mrca + node2_to_mrca;
};

export const get_pairwise_distances = (target_nodes: NSNode[]) => {
  let pairwise_dist: Array<{ nodes: Array<NSNode>; dist: number }> = [];

  for (let i = 0; i < target_nodes.length - 1; i++) {
    for (let j = i + 1; j < target_nodes.length; j++) {
      let pair = [target_nodes[i], target_nodes[j]];
      let result = { nodes: pair, dist: get_dist(pair) };
      pairwise_dist.push(result);
    }
  }

  return pairwise_dist;
};

export const get_leaves = (mrca: NSNode) => {
  const all_children: Array<NSNode> = traverse_preorder(mrca); // HELP: will this give me an array of *all* the returned values (from each recursive iteration?)
  return all_children.filter((n: NSNode) => {
    n.children === undefined || n.children.length === 0;
  });
};

export const get_root = (node: NSNode) => {
  let current_node = node;
  while (node.parent) {
    current_node = node.parent;
  }
  return node;
};
