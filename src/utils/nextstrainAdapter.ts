import { Node } from "../d";
import { numericToDateObject, parseDateString } from "./dates";
import {
  assignTipCount,
  describeTree,
  determineIfInternalNodeDates,
} from "./treeMethods";

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

const parseDateAttrs = (tmpNode: NSNode) => {
  let _date: {
    value: Date | number;
    confidence: Array<Date | number>;
  } = { value: NaN, confidence: [NaN, NaN] };

  if (
    !tmpNode.node_attrs ||
    (!Object.keys(tmpNode.node_attrs).includes("date") &&
      !Object.keys(tmpNode.node_attrs).includes("num_date"))
  ) {
    return _date;
  }

  let dateAttr = Object.keys(tmpNode.node_attrs).includes("date")
    ? "date"
    : "num_date";

  _date.value =
    dateAttr === "date"
      ? parseDateString(tmpNode.node_attrs.date.value)
      : numericToDateObject(tmpNode.node_attrs.num_date.value);

  if (tmpNode.node_attrs[dateAttr].confidence) {
    _date.confidence =
      dateAttr === "date"
        ? tmpNode.node_attrs[dateAttr].confidence.map(parseDateString)
        : tmpNode.node_attrs[dateAttr].confidence.map(numericToDateObject);
  }

  return _date;
};

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

  tmpNode.node_attrs["num_date"] = parseDateAttrs(tmpNode);

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

export const validateNextstrainJson = (nextstrainJSON: NSJSON) => {
  // top level must have at least `tree` and `meta` as objects
  if (
    !(
      Object.keys(nextstrainJSON).includes("tree") &&
      Object.keys(nextstrainJSON).includes("meta")
    )
  ) {
    throw new Error("tree json missing top level key");
  }
  const tree = nextstrainJSON.tree;
  if (
    // root node must have a name and children
    !Object.keys(tree).includes("children") ||
    !Object.keys(tree).includes("name")
  ) {
    throw new Error("tree json root node missing name and/or children");
  }
  if (
    // all of the root node's children must have a name (might be tips which in nextstrain's schema do not have a `children` attribute)
    //@ts-ignore
    !tree.children.every((ch: NSNode) => Object.keys(ch).includes("name"))
  ) {
    throw new Error("tree json root node's child(ren) missing name");
  }
};

export const ingestNextstrain = (nextstrain_json: NSJSON) => {
  const tree: Node = initializeTree(nextstrain_json.tree, "root"); // root has no parent
  assignTipCount(tree);
  describeTree(tree); // just a console log sense check
  return {
    tree,
    treeTitle: nextstrain_json.meta.title,
    haveInternalNodeDates: determineIfInternalNodeDates(tree),
  };
};
