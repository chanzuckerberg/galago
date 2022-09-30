import { get_root, get_leaves, getNodeAttr } from "./treeMethods";
import { Node } from "../d";

const tidy_values = (values: string[]) => {
  const null_values = ["", null, undefined, "unknown"];
  const unique_values = new Set(values);
  return [...unique_values].filter((v) => !null_values.includes(v)).sort();
};

export const get_country_input_options = (tree: Node) => {
  return tidy_values(
    get_leaves(tree).map((leaf: Node) => getNodeAttr(leaf, "country"))
  );
};

export const get_location_input_options = (
  tree: Node,
  division: string,
  country: string
) => {
  const all_samples = get_leaves(tree);
  const samples_from_country_division = all_samples.filter(
    (s) =>
      getNodeAttr(s, "division") === division &&
      getNodeAttr(s, "country") === country
  );
  const location_options = tidy_values(
    samples_from_country_division.map((s) => getNodeAttr(s, "location"))
  );
  return location_options;
};

export const get_division_input_options = (tree: Node, country: string) => {
  const all_samples = get_leaves(tree);
  const samples_from_country = all_samples.filter(
    (s) => getNodeAttr(s, "country") === country
  );
  const division_options = tidy_values(
    samples_from_country.map((s) => {
      if (getNodeAttr(s, "location")) {
        return getNodeAttr(s, "division");
      } else {
        return undefined;
      }
    })
  );
  return division_options;
};
