import { Node, GISAIDRecord } from "../d";
export type FlattenedAttrs = {
  num_date: Date | null;
  location: string;
  division: string;
  country: string;
};
export type HomeGeo = {
  location: string;
  division: string;
  country: string;
};
export type SpecificityLevels = "location" | "division" | "country" | "global";

export type RecencyValues = 28 | 84 | 364 | 36400;
export const filter_tally = (
  records: Array<FlattenedAttrs> | Array<GISAIDRecord>,
  home_geo: HomeGeo,
  specificity_level: SpecificityLevels,
  recency: RecencyValues,
  recency_fn: Function
) => {
  let matching_records: Array<FlattenedAttrs> | Array<GISAIDRecord> = [];
  if (specificity_level == "location") {
    // match all geo fields down to the location
    //@ts-ignore - bizarre known typescript bug https://github.com/microsoft/TypeScript/issues/33591
    matching_records = records.filter(
      (r: any) =>
        r.location == home_geo["location"] &&
        r.division == home_geo["division"] &&
        r.country == home_geo["country"] &&
        recency_fn(r, recency)
    );
  } else if (specificity_level == "division") {
    // match to state, exclude home locale
    //@ts-ignore - bizarre known typescript bug https://github.com/microsoft/TypeScript/issues/33591
    matching_records = records.filter(
      (r: any) =>
        r.location != home_geo["location"] &&
        r.division == home_geo["division"] &&
        r.country == home_geo["country"] &&
        recency_fn(r, recency)
    );
  } else if (specificity_level == "country") {
    // match to country, exclude home state
    //@ts-ignore - bizarre known typescript bug https://github.com/microsoft/TypeScript/issues/33591
    matching_records = records.filter(
      (r: any) =>
        r.division !== home_geo["division"] &&
        r.country == home_geo["country"] &&
        recency_fn(r, recency)
    );
  } else if (specificity_level == "global") {
    // exclude home country
    //@ts-ignore - bizarre known typescript bug https://github.com/microsoft/TypeScript/issues/33591
    matching_records = records.filter(
      (r: any) => r.country !== home_geo["country"] && recency_fn(r, recency)
    );
  }
  return matching_records;
};

export const get_current_counts = (
  records: Array<Node>,
  home_geo: HomeGeo,
  specificity_level: SpecificityLevels,
  recency: RecencyValues
) => {
  const node_attrs = records.map((r: any) => r.node_attrs); // just take the node_attrs dictionary for each node

  const node_attr_values = (node_attrs: Node["node_attrs"]) => {
    return {
      location: node_attrs.location.value,
      division: node_attrs.division.value,
      country: node_attrs.country.value,
      num_date: node_attrs.num_date.value,
    };
  };

  // further flatten to just the values
  const flat_node_attrs: FlattenedAttrs[] = node_attrs.map((n) =>
    node_attr_values(n)
  );

  const node_attrs_recency_match = (
    node_attrs: FlattenedAttrs,
    recency: number
  ) => {
    // samples in the current dataset / tree have actual dates
    if (
      !Object.keys(node_attrs).includes("num_date") ||
      !node_attrs["num_date"] ||
      !(node_attrs["num_date"] instanceof Date)
    ) {
      return false;
    }
    const diff: Date = new Date(Date.now() - node_attrs["num_date"].getDate());
    const matches_recency: boolean = diff.getUTCDate() - 1 <= recency;
    return matches_recency;
  };

  const matching_records = filter_tally(
    flat_node_attrs,
    home_geo,
    specificity_level,
    recency,
    node_attrs_recency_match
  );
  // console.log("matching_records", matching_records);
  return matching_records.length; // if looking at the present dataset / tree / clade, we can just count the N samples
};

export const get_gisaid_counts = (
  records: Array<GISAIDRecord>,
  home_geo: HomeGeo,
  specificity_level: SpecificityLevels,
  recency: RecencyValues
) => {
  const gisaid_record_recency_match = (
    gisaid_record: GISAIDRecord,
    recency: number
  ) => {
    // samples from gisaid have been pre-processed to count how many per recency bin
    const matches_recency: boolean =
      gisaid_record["days_before_2022_01_26"] == recency;
    return matches_recency;
  };

  //@ts-ignore - this is guaranteed to be of type GISAIDRecord, not FlattenedAttr, because we've typed `records` above
  const matching_records: Array<GISAIDRecord> = filter_tally(
    records,
    home_geo,
    specificity_level,
    recency,
    gisaid_record_recency_match
  );

  return matching_records
    .map((r: GISAIDRecord) => r?.strain)
    .reduce((a: number, b: number) => a + b, 0);
};
