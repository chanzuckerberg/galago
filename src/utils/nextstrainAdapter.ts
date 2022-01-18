export interface NSNode {
  name: string;
  parent: NSNode | undefined; // not in default nextstrain export; add later via traversal
  children: NSNode[]; // terminal nodes (leaves) have no children

  branch_attrs: {
    // values we care about are typed explicitly; other arbitrary values may also be present but not required or typed
    length: number | undefined; // not in default nextstrain export; add later via traversal
    // HELP: add escape hatch here to allow for other arbitrary [key, value] pairs to exist
  };
  node_attrs: {
    // values we care about are typed explicitly; other arbitrary values may also be present but not required or typed
    div: number;
    location: { value: string };
    country: { value: string };
    region: { value: string };
    num_date: { value: number; confidence: number[] }; // HELP: these should be dates (they come in as decimals but we'll want to display them as ISO YYYY-MM-DD)
    // HELP: add escape hatch here to allow for other arbitrary [key, value] pairs to exist
  };
}

export interface NSJSON {
  meta: any; // we don't care about this nextstrain-specific metadata right now
  tree: NSNode;
}
