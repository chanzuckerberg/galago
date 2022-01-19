export interface NSNode {
  name: string;
  parent?: NSNode | undefined; // not in default nextstrain export; add later via traversal
  children?: Array<NSNode> | undefined; // direct descendents of this node (nodes or leaves)

  branch_attrs: {
    // values we care about are typed explicitly; other arbitrary values may also be present but not required or typed
    length: number | undefined; // not in default nextstrain export; add later via traversal
    [key: string]: any;
  };
  node_attrs: {
    // values we care about are typed explicitly; other arbitrary values may also be present but not required or typed
    div: number;
    location: { value: string };
    country: { value: string };
    region: { value: string };
    num_date: { value: number; confidence: number[] };
    [key: string]: any;
  };
}

export interface NSJSON {
  meta: any; // we don't care about this nextstrain-specific metadata right now
  version: string;
  tree: NSNode;
}

import { traverse_preorder, branch_length_from_div } from "./treeMethods";
export const ingest_nextstrain = (nextstrain_json: NSJSON) => {
  let tree: NSNode = nextstrain_json.tree;
  traverse_preorder(tree, branch_length_from_div); // assign parents and branch lengths
  return tree;
};
