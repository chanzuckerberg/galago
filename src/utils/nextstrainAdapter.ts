import { Node } from "../d";
import { numericToDateObject } from "./misc";
import { describeTree } from "./treeMethods";

export interface NSNode {
  name: string;
  children?: Array<NSNode> | undefined; // direct descendents of this node (nodes or leaves)

  branch_attrs?: {
    [key: string]: any;
  };
  node_attrs?: {
    div: number;
    [key: string]: any;
  };
}

export interface NSJSON {
  meta: any; // we don't care about this nextstrain-specific metadata right now
  version: string;
  tree: NSNode;
}

export const NSNodeToNode = (node: NSNode, parent: Node | "root") => {
  let tmpNode: any = { ...node };

  // fix any missing relationships
  tmpNode.parent = parent && parent != "root" ? parent : null;
  tmpNode.children ??= [];
  tmpNode.branch_attrs ??= {};
  tmpNode.node_attrs ??= {};

  tmpNode.branch_attrs.length =
    parent && tmpNode.node_attrs["div"] && tmpNode.parent.node_attrs["div"]
      ? tmpNode.node_attrs["div"] - tmpNode.parent.node_attrs["div"]
      : NaN;
  ["location", "division", "country"].forEach(
    (attr) => (tmpNode.node_attrs[attr] ??= { value: "unknown" })
  );

  // convert dates
  const rawNumDateData = tmpNode.node_attrs.num_date.value;
  tmpNode.node_attrs.num_date.value = tmpNode.node_attrs.num_date.value
    ? numericToDateObject(tmpNode.node_attrs.num_date.value)
    : NaN;
  tmpNode.node_attrs.num_date.confidence = tmpNode.node_attrs.num_date
    .confidence
    ? tmpNode.node_attrs.num_date.confidence.map((n: number) =>
        numericToDateObject(n)
      )
    : [NaN, NaN];

  if (isNaN(tmpNode.node_attrs.num_date.value)) {
    console.log(rawNumDateData, tmpNode.node_attrs.num_date.value);
  }
  if (isNaN(tmpNode.node_attrs.num_date.value)) {
    console.log("original numdate values", rawNumDateData);
  }
  if (!(tmpNode.node_attrs.num_date.value instanceof Date)) {
    console.log(rawNumDateData);
  }

  const newNode: Node = { ...tmpNode };
  return newNode;
};

export const initializeTree = (node: NSNode, parent: Node | "root") => {
  // convert the current node
  let newNode: Node = NSNodeToNode(node, parent);

  // now recursively visit children, left to right
  if (newNode.children && newNode.children.length > 0) {
    for (var i = 0; i < newNode.children.length; i++) {
      newNode.children[i] = initializeTree(newNode.children[i], newNode);
    }
  }

  return newNode;
};

export const ingestNextstrain = (nextstrain_json: NSJSON) => {
  const tree: Node = initializeTree(nextstrain_json.tree, "root"); // root has no parent
  describeTree(tree);
  return tree;
};
