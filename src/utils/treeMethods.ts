import { NSNode } from "./nextstrainAdapter";

export const traverse_preorder = (
  node: NSNode,
  node_fn?: Function,
  parent?: NSNode
) => {
  if (node_fn) {
    node_fn(node);
  }
  if (parent) {
    node.parent = parent;
  }

  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      traverse_preorder(
        (node = node.children[i]),
        (node_fn = node_fn),
        (parent = node)
      );
    }
  }
};

export const traverse_postorder = (node: NSNode, node_fn?: Function) => {
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      traverse_postorder((node = node.children[i]), (node_fn = node_fn));
    }
  }

  if (node_fn) {
    node_fn(node);
  }
};

export const find_mrca = (target_nodes: NSNode[]) => {
  // if only one node given, return itself
  if (new Set(target_nodes).size === 1) {
    return target_nodes[0];
  }

  var ref_node: NSNode | null = null; // first node in the list of targets
  var ref_node_path: NSNode[] = []; // path between ref_node and the root
  var paths = [];

  for (var i = 0; i < target_nodes.length; i++) {
    // iterate over target nodes and record the path between this node and the root of the tree
    var current_node: NSNode | null = target_nodes[i];
    var this_path = Object();
    this_path["node"] = current_node;
    this_path["path"] = [];

    while (current_node) {
      // while we haven't yet reached the root...
      this_path["path"].push(current_node);
      if (!ref_node) {
        // if no reference node defined yet, add the current_node to the 'ref_node_path' list
        ref_node_path.push(current_node);
      }
      if (current_node.parent) {
        // if not yet at the root, move up to the parent
        current_node = current_node.parent;
      } else {
        current_node = null;
      } // if we reach the root, break the loop and reset the current_node pointer
      current_node = null;
    }
    paths.push(this_path); // add this path to the list of node paths

    if (!ref_node) {
      // if no reference node, use the current_node target node
      ref_node = target_nodes[i];
    }
  }

  for (i = 0; i < ref_node_path.length; i++) {
    // the mrca must be contained in the path between the first node and the root. test each one.
    var current_candidate_node = ref_node_path[i];
    var still_a_candidate = true;
    for (i = 0; i < paths.length; i++) {
      // iterate through the paths between each target node and the root of the tree
      var current_target_node = paths[i]["node"];
      var current_path = paths[i]["path"];

      // if the current candidate node is not present in every path between each target node and the root, move on -- it's not the mrca
      if (
        current_target_node !== ref_node &&
        !current_path.includes(current_candidate_node)
      ) {
        still_a_candidate = false;
        break;
      }

      if (still_a_candidate) {
        var mrca = current_candidate_node; // because nodes are added to each path in order from most recent -> most ancestral, the first time we encounter a node that is in every path, we've found the mrca
        return mrca;
      }
    }
  }
};
