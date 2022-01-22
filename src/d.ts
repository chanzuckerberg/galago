import {
  get_mrca,
  get_leaves,
  get_pairwise_distances,
  get_root,
  get_parent_for_cousins,
} from "./utils/treeMethods";

// export interface Introduction {
//   source_loc: string;
//   date_min: string;
//   date_max: string;
//   n_samples: string;
// }

export interface Node {
  name: string;
  parent: Node | undefined; // not in default nextstrain export; add later via traversal
  children: Array<Node>; // direct descendents of this node (nodes or leaves)

  branch_attrs: {
    // values we care about are typed explicitly; other arbitrary values may also be present but not required or typed
    length: number; // not in default nextstrain export; add later via traversal
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

export interface CladeDescription {
  selected_samples: Node[];
  unselected_samples_in_cluster: Node[];

  muts_bn_selected_minmax: number[];
  muts_per_trans_minmax: number[]; // user input

  mrca: Node | void;
  parent_for_cousins: Node | undefined;

  cousins: Node[];

  home_geo: {
    // user input
    location: string;
    division: string;
    country: string;
    region: string;
  };

  // transmissions_across_demes: {
  //   location: Introduction[];
  //   division: Introduction[];
  //   country: Introduction[];
  //   region: Introduction[];
  // };
}

export const describe_clade = (
  selected_samples: Array<Node>,
  // tree: Node,
  home_geo: {
    location: string;
    division: string;
    country: string;
    region: string;
  },
  muts_per_trans_minmax: number[],
  min_muts_to_parent: number
) => {
  const muts_bn_selected: Array<{ nodes: Node[]; dist: number }> =
    get_pairwise_distances(selected_samples);
  const mrca: Node | void = get_mrca(selected_samples);
  const parent_for_cousins: Node | undefined = mrca
    ? get_parent_for_cousins(mrca, min_muts_to_parent)
    : undefined;
  let clade: CladeDescription = {
    selected_samples: selected_samples,
    mrca: mrca,
    unselected_samples_in_cluster: mrca
      ? get_leaves(mrca).filter((n) => !selected_samples.includes(n))
      : [],
    parent_for_cousins: parent_for_cousins,
    cousins:
      mrca && parent_for_cousins
        ? get_leaves(parent_for_cousins).filter(
            (n) => !get_leaves(mrca).includes(n)
          )
        : [],
    home_geo: home_geo,
    muts_per_trans_minmax: muts_per_trans_minmax,
    muts_bn_selected_minmax: [
      Math.min(...muts_bn_selected.map((a) => a["dist"])),
      Math.max(...muts_bn_selected.map((a) => a["dist"])),
    ],
  };
  return clade;
};
