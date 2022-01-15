import { Node } from "../d";

const unpack_attrs = (attrs: Object) => {
  // ns metadata often comes through as nested dictionaries of attributes such as {'location': {'value': 'Orange County', 'confidence': '97.3'}}
  // returns a flat attribute dictionary that uses prefixes instead of nesting
  var tidy_attrs = {};

  for (const [key, value] of Object.entries(attrs)) {
    if (!typeof value === Object()) {
      // not a nested dictionary; just assign and move on
      tidy_attrs[key] = value;
    } else if (value.keys().length === 0) {
      // empty nested dictionary; move on
      continue;
    } else {
      for (const [sub_key, sub_value] of Object.entries(value)) {
        // nested dictionary; unpack each one
        if (sub_key === "value") {
          // e.g., {'location': {'value': 'Orange County', 'confidence': 97.3} => {'location': 'Orange County', 'location_confidence': 97.3}
          tidy_attrs[key] = sub_value;
        } else {
          tidy_attrs[key + "_" + sub_key] = sub_value;
        }
      }
    }
  }
  return tidy_attrs;
};

const parse_metadata = (attrs: object, node: Node) => {
  // attrs: dictionary of either `branch_attrs` or `node_attrs` from the nextstrain json
  // node: node to attach these two
  // top_level_attrs: most important attributes to keep track of as top-level attributes of `node` (relegate the rest to node.metadata)
  // side effect: modifies node in place to attach these attributes as `node.features` per ETE3 convention.
  //                 these can later be referenced via `node.attribute_name => value`

  const tidy_attrs = unpack_attrs(attrs);
  for (const [key, value] of Object.entries(tidy_attrs))
    if (node.keys().includes(key)) {
      // HELP: how do I check if this is one of the predefined attributes (lines 54 - 64)??
      node.key = value;
    } else {
      node.metadata.key = value;
    }
};

const make_node = (ns_node: any, parent?: Node) => {
  // ns_node: portion of the nextstrain tree JSON representing either an internal node or leaf
  // returns: ete3 TreeNode object with all attributes and relationships populated from the nextstrain JSON

  var node: Node = {
    parent: parent || undefined,
    div: 0,
    branch_length: 0,
    name: ns_node.name || "root",
    location: "",
    division: "",
    country: "",
    region: "",
    collection_date: "", // HELP: this comes in as a decimal date. How to parse to a `date` type?
    metadata: {},
    children: [],
  };

  if (ns_node.keys().includes("branch_attrs")) {
    parse_metadata(ns_node.branch_attrs, node);
  }

  if (ns_node.keys().includes("node_attrs")) {
    parse_metadata(ns_node.node_attrs, node);
  }

  if (parent) {
    // Root of the tree (first node parsed) will not have a parent; all others will
    node.branch_length = parent.div - node.div;
  }

  if (ns_node.keys().includes("children") && ns_node.children.length > 0) {
    // This is the important bit: recursively walk to each child and make it into another node
    for (var i = 0; i < ns_node.children.length; i++) {
      node.children.push(make_node(ns_node.children[i], node));
    }
  }

  return node;
};

function make_tree(ns_json: Object) {
  return make_node(ns_json.tree);
}
