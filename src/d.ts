import { NSNode } from "./utils/nextstrainAdapter";
import {
  get_mrca,
  get_leaves,
  get_pairwise_distances,
  get_dist,
} from "./utils/treeMethods";

// export interface Introduction {
//   source_loc: string;
//   date_min: string;
//   date_max: string;
//   n_samples: string;
// }

export interface CladeDescription {
  selected_samples: NSNode[];
  unselected_samples_in_cluster: NSNode[];

  muts_bn_selected_minmax: number[];
  muts_per_trans_minmax: number[]; // user input

  mrca: NSNode;

  muts_from_parent: number;
  cousins: NSNode[];

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
  selected_samples: Array<NSNode>,
  tree: NSNode,
  home_geo: {
    location: string;
    division: string;
    country: string;
    region: string;
  },
  muts_per_trans_minmax: number[]
) => {
  const muts_bn_selected: number[] = get_pairwise_distances(selected_samples);
  const mrca: NSNode = get_mrca(selected_samples); // same issue as in `treeMethods` line 115 (return value is declared as NSNode, why is this still mad)
  let clade: CladeDescription = {
    selected_samples: selected_samples,
    mrca: mrca,
    unselected_samples_in_cluster: get_leaves(mrca).filter(
      (n) => !selected_samples.includes(n)
    ),
    cousins: get_leaves(mrca.parent).filter(
      (n) => !get_leaves(mrca).includes(n)
    ),
    home_geo: home_geo,
    muts_per_trans_minmax: muts_per_trans_minmax,
    muts_bn_selected_minmax: [
      Math.min.apply(muts_bn_selected),
      Math.max.apply(muts_bn_selected),
    ],
    muts_from_parent: get_dist([mrca, mrca.parent]),
  };
  return clade;
};

export interface DatasetDescription {
  all_samples: Node[];
}
