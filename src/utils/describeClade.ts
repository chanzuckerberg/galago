import { Node, CladeDescription } from "../d";
import {
  get_mrca,
  get_leaves,
  calcPairwiseDistances,
  get_root,
  get_parent_for_cousins,
  getAttrChanges,
  traverse_preorder,
} from "./treeMethods";

const catalog_subclades = (
  mrca: Node,
  home_geo: {
    location: string;
    division: string;
    country: string;
    region?: string;
  }
) => {
  const geo_levels: string[] = ["location", "division", "country"];
  const all_samples = get_leaves(mrca);
  for (let i = 0; i < geo_levels.length; i++) {
    if (
      all_samples.every((e) => {
        //@ts-ignore - this yells about not being able to use a string to index home_geo
        e.node_attrs[geo_levels[i]] === home_geo[geo_levels[i]];
      })
    ) {
      return {
        returned_subclade_geo: geo_levels[i],
        returned_subclades: [],
      };
    }

    if (Object.keys(mrca.node_attrs[geo_levels[i]]).includes("confidence")) {
      const subclades = getAttrChanges(mrca, geo_levels[i], "nextstrain");
      return {
        returned_subclade_geo: geo_levels[i],
        returned_subclades: subclades,
      };
    }
  }
  return {
    returned_subclade_geo: null,
    returned_subclades: [],
  };
};

export const describe_clade = (
  mrca: Node,
  home_geo: {
    location: string;
    division: string;
    country: string;
    region?: string;
  },
  muts_per_trans_minmax: number[],
  min_muts_to_parent: number,
  selected_samples: Array<Node> = []
) => {
  const parent_for_cousins: Node | undefined = get_parent_for_cousins(
    mrca,
    min_muts_to_parent
  );
  const { returned_subclade_geo, returned_subclades } = catalog_subclades(
    mrca,
    home_geo
  );

  let clade: CladeDescription = {
    selected_samples: selected_samples,
    mrca: mrca,
    unselected_samples_in_cluster: get_leaves(mrca).filter(
      (n) => !selected_samples.includes(n)
    ),
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
    pairwiseDistances: calcPairwiseDistances(get_leaves(mrca)),
    subclade_geo: returned_subclade_geo,
    subclades: returned_subclades,
  };
  // console.log("clade description", clade);
  return clade;
};
