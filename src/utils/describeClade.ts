import { Node, CladeDescription } from "../d";
import {
  get_leaves,
  get_parent_for_cousins,
  getAttrChanges,
} from "./treeMethods";

const catalog_subclades = (
  mrca: Node,
  home_geo: {
    location?: string;
    division?: string;
    country?: string;
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
  min_muts_to_parent: number,
  selected_samples: Array<Node> = [],
  home_geo?: {
    location?: string;
    division?: string;
    country?: string;
  }
) => {
  const parent_for_cousins: Node | undefined = get_parent_for_cousins(
    mrca,
    min_muts_to_parent
  );

  const clade_samples = get_leaves(mrca);

  let clade: CladeDescription = {
    selected_samples: selected_samples.filter((n: Node) =>
      clade_samples.includes(n)
    ),
    unselected_samples_in_cluster: clade_samples.filter(
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
  };

  // TODO: soften this requirement such that we try to get introductions at whatever level of granularity the user provided, using nextstrain when available and matutils if not
  if (home_geo && home_geo.country && home_geo.division && home_geo.location) {
    const { returned_subclade_geo, returned_subclades } = catalog_subclades(
      mrca,
      home_geo
    );
    //@ts-ignore
    clade.home_geo = home_geo;
    clade.subclade_geo = returned_subclade_geo;
    clade.subclades = returned_subclades;
  }

  return clade;
};
