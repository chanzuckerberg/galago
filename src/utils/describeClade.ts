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
  const mrca: Node = get_mrca(selected_samples);
  const tmrca = mrca.node_attrs.num_date.value;
  console.log(
    "MRCA DATE / TYPE / NAN IN DESCRIBE CLADE",
    tmrca,
    typeof tmrca,
    isNaN(tmrca)
  );
  const parent_for_cousins: Node | undefined = get_parent_for_cousins(
    mrca,
    min_muts_to_parent
  );

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
    subtrees: [], //catalog_subclades(selected_samples, mrca), // subtrees,
  };
  console.log("clade description", clade);
  return clade;
};
