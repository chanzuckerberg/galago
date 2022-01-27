import { Node, GISAIDRecord } from "../d";

const node_attrs_recency_match = (node_attrs: any, recency: number) => {
  // samples in the current dataset / tree have actual dates
  const diff: Date = new Date(Date.now() - node_attrs["num_date"]["value"]);
  const matches_recency: boolean = diff.getUTCDate() - 1 <= recency;
  return matches_recency;
};

const gisaid_record_recency_match = (gisaid_record: any, recency: number) => {
  // samples from gisaid have been pre-processed to count how many per recency bin
  const matches_recency: boolean =
    gisaid_record["recency <= N days since 2022-01-26"] == recency;
  return matches_recency;
};

const get_counts = (
  records: Array<GISAIDRecord> | Array<Node> | any, // any accommodates looking at just the node_attrs of Node so that we can share code
  home_geo = {
    location: "Humboldt County",
    division: "California",
    country: "USA",
  },
  specificity_level: "location" | "division" | "country" | "global",
  recency: 28 | 84 | 364 | 36400
) => {
  //parse dates on the current dataset as necessary
  const recency_fn: Function =
    records[0] instanceof Node
      ? node_attrs_recency_match
      : gisaid_record_recency_match;

  if (records[0] instanceof Node) {
    // since we're just counting, we can ignore all the other elements of Node and just handle the node_attrs for easier comparisons
    records = records.map((r: any) => r.node_attrs);
  }

  let matching_records = [];
  if (specificity_level == "location") {
    // match all geo fields down to the location
    matching_records = records.filter(
      (r: any) =>
        r.location == home_geo["location"] &&
        r.division == home_geo["division"] &&
        r.country == home_geo["country"] &&
        recency_fn(r, recency)
    );
  } else if (specificity_level == "division") {
    // match to state, exclude home locale
    matching_records = records.filter(
      (r: any) =>
        r.location != home_geo["location"] &&
        r.division == home_geo["division"] &&
        r.country == home_geo["country"] &&
        recency_fn(r, recency)
    );
  } else if (specificity_level == "country") {
    // match to country, exclude home state
    matching_records = records.filter(
      (r: any) =>
        r.division !== home_geo["division"] &&
        r.country == home_geo["country"] &&
        recency_fn(r, recency)
    );
  } else if (specificity_level == "global") {
    // exclude home country
    matching_records = records.filter(
      (r: any) => r.country !== home_geo["country"] && recency_fn(r, recency)
    );
  }

  if (matching_records[0] instanceof GISAIDRecord) {
    // need to pull out the pre-computed count of individual strains in each bin and sum them
    return matching_records
      .map((r: GISAIDRecord) => r.strain)
      .reduce((a: number, b: number) => a + b, 0);
  } else {
    return matching_records.length; // if looking at the present dataset / tree / clade, we can just count the N samples
  }
};

const add_text_cell_to_column = (
  text: string,
  set_width: number,
  set_height: number
) => {
  return (
    <p
      style={{
        width: set_width,
        height: set_height,
      }}
    >
      {`${text}`}
    </p>
  );
};

const add_cell_to_column = (
  numerator_data: Node[],
  denominator_data: GISAIDRecord[],
  home_geo = {
    location: "Humboldt County",
    division: "California",
    country: "USA",
  },
  specificity_level: "location" | "division" | "country" | "global",
  recency: 28 | 84 | 364 | 36400,
  set_height = "100",
  set_width = "100"
) => {
  const numerator = get_counts(
    numerator_data,
    home_geo,
    specificity_level,
    recency
  );
  const denominator = get_counts(
    denominator_data,
    home_geo,
    specificity_level,
    recency
  );
  return (
    <p
      style={{
        width: set_width,
        height: set_height,
      }}
    >
      {`${numerator} / ${denominator}`}
      <br />
      {`(${((numerator / denominator) * 100).toFixed(0)}%)`}
    </p>
  );
};

const add_column_to_table = (
  numerator_data: Node[],
  denominator_data: GISAIDRecord[],
  home_geo = {
    location: "Humboldt County",
    division: "California",
    country: "USA",
  },
  recency: 28 | 84 | 364 | 36400
) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
      }}
    >
      {add_text_cell_to_column("foobar", 100, 100)}
    </div>
  );
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function SampleDistributionTable(
  gisaid_census: Array<GISAIDRecord>,
  all_samples: Array<Node>,
  selected_samples: Array<Node>
) {
  // const { data } = props;

  return (
    <div // actual table container
      style={{
        border: "3px solid pink",
        display: "flex",
        flexDirection: "row",
        // width: 2000,
      }}
    >
      {add_column_to_table(
        all_samples,
        gisaid_census,
        { location: "Humboldt County", division: "California", country: "USA" },
        28
      )}
    </div>
  );
}

export default SampleDistributionTable;
