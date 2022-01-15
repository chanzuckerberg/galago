import { Node } from "../d";

const traverseTree = (root_node: Node) => {
  // in: root node of the tree
  // does: walks through the tree, making a note for each internal node with the `leaves` (terminal nodes / samples) that descend from it
  // e.g.: internal_node = {name: 'foo', 'parent': Node, children: [other_internal_node_1, terminal_node, other_terminal_node_that_descends_from_other_internal_node_1], leaves: [terminal_node]}
};

const findMRCA = (samples: Node[]) => {
  // in: array of nodes (samples)
  // out: single node, representing the shallowest (furthest from the root / closest to the leaves) node in the tree that contains all of the samples as descendents
};
