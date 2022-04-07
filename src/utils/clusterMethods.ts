import { Node } from "../d";
import {
  get_leaves,
  get_state_changes,
  traverse_preorder,
} from "./treeMethods";

export const nodeToNodeData = (node: Node) => {
  return {
    name: node.name,
    date: node.node_attrs.num_date.value,
    samples: get_leaves(node),
    raw: node,
  };
};

export const trimDeepNodes = (tree: Node, maxDescendents?: number) => {
  maxDescendents ??= get_leaves(tree).length / 10;

  const shallow_nodes = traverse_preorder(
    tree,
    //@ts-ignore -- we safeguard against null maxDescendent values in line above
    (n: Node) => get_leaves(n).length < maxDescendents
  );
  return shallow_nodes.map((n) => nodeToNodeData(n));
};

export const nextstrainGeo = (tree: Node, trait: string = "location") => {
  return get_state_changes(tree, trait).map((n) => nodeToNodeData);
};
