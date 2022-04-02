import { Node } from "../d";
import {
  get_dist,
  get_leaves,
  get_root,
  traverse_preorder,
} from "../utils/treeMethods";

interface mutsDateScatterProps {
  tree: Node;
}

function MutsDateScatter(props: mutsDateScatterProps) {
  const { tree } = props;
  const all_samples = get_leaves(tree);
  const all_internal_nodes = traverse_preorder(
    tree,
    (node: Node) => node.children.length === 0
  );
  const root = get_root(tree);

  let sample_data_points = {}; // {sample name : [date, muts from root]}
  all_samples.forEach((sample: Node) => {
    sample_points[sample.name] = [
      sample.node_attrs.num_date,
      get_dist([root, sample]),
    ];
  });

  let internal_nodes_to_descendents = {}; // {internal node name: [sample names for all leaves descendent from this internal node]}
  all_internal_nodes.forEach((node: Node) => {
    internal_nodes_to_descendents[node.name] = get_leaves(node).map(
      (l: Node) => {
        l.name;
      }
    );
  });

  let internal_node_dates = {}; // {internal node name: date}
  all_internal_nodes.forEach((node: Node) => {
    internal_nodes_to_descendents[node.name] = node.node_attrs.num_date;
  });
}

export default MutsDateScatter;
