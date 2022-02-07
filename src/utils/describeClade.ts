import { Node, CladeDescription } from "../d";
import {
  get_mrca,
  get_leaves,
  get_pairwise_distances,
  get_root,
  get_parent_for_cousins,
  get_state_changes,
} from "./treeMethods";

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

  // let subtrees: Node[] = [];
  // const geo_levels = ["location", "division", "country"];
  // for (let i = 0; i < geo_levels.length; i++) {
  //   console.log(geo_levels[i]);
  // }
  //     if (
  //       Object.keys(selected_samples[0].node_attrs[geo_levels[i]]).includes(
  //         "confidence"
  //       )
  //     ) {
  //       subtrees = get_state_changes(
  //         get_root(selected_samples[0]),
  //         geo_levels[i]
  //       );
  //       break;
  //     }
  //   }

  let clade: CladeDescription = {
    selected_samples: selected_samples,
    mrca: mrca,
    unselected_samples_in_cluster: mrca
      ? get_leaves(mrca).filter((n) => !selected_samples.includes(n))
      : [],
    parent_for_cousins: parent_for_cousins,
    min_muts_to_parent: min_muts_to_parent,
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
    subtrees: [], // subtrees,
  };
  return clade;
};
