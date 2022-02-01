import { Node, GISAIDRecord } from "../d";

const filter_tally = (
  records: Array<{
    location: string;
    division: string;
    country: string;
    region: string;
  }>,
  home_geo = {
    location: "Humboldt County",
    division: "California",
    country: "USA",
  },
  specificity_level: "location" | "division" | "country" | "global",
  recency: 28 | 84 | 364 | 36400,
  recency_fn: Function
) => {
  let matching_records: Array<Object> = [];
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
  return matching_records;
};

const get_current_counts = (
  records: Array<Node>,
  home_geo = {
    location: "Humboldt County",
    division: "California",
    country: "USA",
  },
  specificity_level: "location" | "division" | "country" | "global",
  recency: 28 | 84 | 364 | 36400
) => {
  const node_attrs = records.map((r: any) => r.node_attrs); // just take the node_attrs dictionary for each node
  const node_attrs_recency_match = (node_attrs: Object, recency: number) => {
    // samples in the current dataset / tree have actual dates
    if (
      !(
        Object.keys(node_attrs).includes("num_date") &&
        Object.keys(node_attrs.num_date).includes("value")
      )
    ) {
      return false;
    }
    const diff: Date = new Date(Date.now() - node_attrs["num_date"]["value"]);
    const matches_recency: boolean = diff.getUTCDate() - 1 <= recency;
    return matches_recency;
  };
  const matching_records = filter_tally(
    node_attrs,
    home_geo,
    specificity_level,
    recency,
    node_attrs_recency_match
  );
  return matching_records.length; // if looking at the present dataset / tree / clade, we can just count the N samples
};

const get_gisaid_counts = (
  records: Array<GISAIDRecord>,
  home_geo = {
    location: "Humboldt County",
    division: "California",
    country: "USA",
  },
  specificity_level: "location" | "division" | "country" | "global",
  recency: 28 | 84 | 364 | 36400
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

  const matching_records = filter_tally(
    records,
    home_geo,
    specificity_level,
    recency,
    gisaid_record_recency_match
  );

  return matching_records
    .map((r: Object) => r["strain"])
    .reduce((a: number, b: number) => a + b, 0);
};

const add_counts_cell_to_column = (
  current_samples: Node[],
  gisaid_records: GISAIDRecord[],
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
  const numerator = get_current_counts(
    current_samples,
    home_geo,
    specificity_level,
    recency
  );
  // TODO: how do we want to deal with either deduplicating or double counting?
  const denominator =
    get_gisaid_counts(gisaid_records, home_geo, specificity_level, recency) +
    numerator;
  return (
    <p
      style={{
        maxWidth: set_width,
        height: set_height,
        flexShrink: 0,
        flexGrow: 0,
      }}
    >
      {`${numerator.toLocaleString("en-US")} / ${denominator.toLocaleString(
        "en-US"
      )}`}
      <br />
      {`(${((numerator / denominator) * 100).toFixed(1)}%)`}
    </p>
  );
};

const add_text_cell_to_column = (
  text: string,
  set_width: number,
  set_height: number
) => {
  return (
    <p
      style={{
        maxWidth: set_width,
        overflow: "wrap",
        height: set_height,
        flexShrink: 0,
        flexGrow: 0,
      }}
    >
      {`${text}`}
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
  set_width: string = "200",
  set_height: string = "50"
) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        margin: 0,
        padding: 0,
        justifyContent: "space-between",
      }}
    >
      {add_text_cell_to_column("foobar", 100, 100)}
    </div>
  );
};

interface SampleTableProps {
  gisaid_census: GISAIDRecord[];
  all_samples: Array<Node>;
  selected_samples: Array<Node>;
}

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function SampleDistributionTable(props: SampleTableProps) {
  const { all_samples, gisaid_census, selected_samples } = props;

  return (
    <div // actual table container
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "space-between",
        maxWidth: 800,
        padding: 10,
      }}
    >
      <div // Top labels
        style={{
          display: "flex",
          flexDirection: "row",
          margin: 0,
          padding: 0,
          justifyContent: "space-between",
          alignItems: "space-between",
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
