import { Node } from "../d";
import { numericToDateObject } from "./misc";

export interface NSNode {
  name: string;
  children?: Array<NSNode> | undefined; // direct descendents of this node (nodes or leaves)

  branch_attrs?: {
    // values we care about are typed explicitly; other arbitrary values may also be present but not required or typed
    [key: string]: any;
  };
  node_attrs?: {
    // values we care about are typed explicitly; other arbitrary values may also be present but not required or typed
    div: number;
    // location: { value: string };
    // country: { value: string };
    // region: { value: string };
    // num_date: { value: number; confidence: number[] };
    [key: string]: any;
  };
}

export interface NSJSON {
  meta: any; // we don't care about this nextstrain-specific metadata right now
  version: string;
  tree: NSNode;
}

export const initialize_tree = (
  node: NSNode,
  parent?: Node,
  counter: number = 0
) => {
  // initializes a tree from the nextstrain JSON. specifically, adds parents, branch lengths and children.

  if (counter > 10000) {
    console.error("infinite recursion in tree initiation");
    return;
  }
  //@ts-ignore
  let newNode: Node = { ...node }; // we fix the typescript error about parents below.

  if (!Object.keys(newNode).includes("branch_attrs")) {
    newNode["branch_attrs"] = {
      length: NaN,
    };
  }

  if (!Object.keys(newNode).includes("node_attrs")) {
    newNode.node_attrs = {
      // no attributes present
      div: NaN,
      location: { value: "" },
      country: { value: "" },
      region: { value: "" },
      num_date: { value: null, confidence: [null, null] },
    };
  }
  if (Object.keys(newNode.node_attrs).includes("num_date")) {
    if (
      Object.keys(newNode.node_attrs.num_date).includes("value") &&
      typeof newNode.node_attrs.num_date.value === "number"
    ) {
      newNode.node_attrs.num_date.value = numericToDateObject(
        newNode.node_attrs.num_date.value
      );
    }
    if (Object.keys(newNode.node_attrs.num_date).includes("confidence")) {
      if (
        typeof newNode.node_attrs.num_date.confidence[0] === "number" &&
        typeof newNode.node_attrs.num_date.confidence[1] === "number"
      ) {
        newNode.node_attrs.num_date.confidence[0] = numericToDateObject(
          newNode.node_attrs.num_date.confidence[0]
        );
        newNode.node_attrs.num_date.confidence[1] = numericToDateObject(
          newNode.node_attrs.num_date.confidence[1]
        );
      }
    }
  }

  //add parent and branch length to each node
  if (parent) {
    newNode.parent = parent;
    newNode.branch_attrs.length =
      newNode.node_attrs["div"] - newNode.parent.node_attrs["div"];
  } else {
    newNode.parent = undefined;
    newNode.branch_attrs.length = NaN;
  }

  // add a placeholder for children so we don't have so many type errors
  if (!newNode.children) {
    newNode.children = [];
  }

  // backfill any missing geo metadata
  const required_node_attrs = ["location", "division", "country", "region"];
  for (let i = 0; i < required_node_attrs.length; i++) {
    let attr = required_node_attrs[i];
    if (
      !Object.keys(newNode.node_attrs).includes(attr) ||
      !newNode.node_attrs.attr
    ) {
      newNode.node_attrs[attr] = { value: "unknown" };
    }
  }

  // backfill any missing dates
  if (
    !Object.keys(newNode.node_attrs).includes("num_date") ||
    !newNode.node_attrs.num_date
  ) {
    newNode.node_attrs.num_date = { value: null, confidence: [null, null] };
  }
  // now recursively visit children, left to right
  for (var i = 0; i < newNode.children.length; i++) {
    //@ts-ignore -- initialize_tree always returns an object of type Node
    newNode.children[i] = initialize_tree(
      (node = newNode.children[i]),
      (parent = newNode),
      (counter = counter + 1)
    );
  }

  return newNode;
};

export const ingest_nextstrain = (nextstrain_json: NSJSON) => {
  //@ts-ignore -- initialize_tree always returns an object of type Node
  const tree: Node = initialize_tree(nextstrain_json.tree); // adds parents, branch lengths, and children to NSJSON
  return tree; // assign parents and branch lengths
};
