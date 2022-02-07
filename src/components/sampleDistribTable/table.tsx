import { Node, GISAIDRecord, CladeDescription } from "../d";

type FlattenedAttrs = {
  num_date: Date | null;
  location: string;
  division: string;
  country: string;
};
type HomeGeo = {
  location: string;
  division: string;
  country: string;
};
type SpecificityLevels = "location" | "division" | "country" | "global";

type RecencyValues = 28 | 84 | 364 | 36400;

const filter_tally = (
  records: Array<FlattenedAttrs> | Array<GISAIDRecord>,
  home_geo: HomeGeo,
  specificity_level: SpecificityLevels,
  recency: RecencyValues,
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

export const get_current_counts = (
  records: Array<Node>,
  home_geo: HomeGeo,
  specificity_level: SpecificityLevels,
  recency: RecencyValues
) => {
  const node_attrs: Array<Node["node_attrs"]> = records.map(
    (r: any) => r.node_attrs
  ); // just take the node_attrs dictionary for each node

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

  const matching_records: Array<GISAIDRecord> = filter_tally(
    records,
    home_geo,
    specificity_level,
    recency,
    gisaid_record_recency_match
  );

  return matching_records
    .map((r: GISAIDRecord) => r["strain"])
    .reduce((a: number, b: number) => a + b, 0);
};

const add_counts_cell = (
  current_samples: Node[],
  gisaid_records: GISAIDRecord[],
  home_geo: {
    location: string;
    division: string;
    country: string;
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
      key={`${specificity_level}+${recency}`}
    >
      {`${numerator.toLocaleString("en-US")} / ${denominator.toLocaleString(
        "en-US"
      )}`}
      <br />
      {`(${((numerator / denominator) * 100).toFixed(1)}%)`}
    </p>
  );
};

const add_text_cell = (text: string, set_width: string, set_height: string) => {
  return (
    <p
      style={{
        maxWidth: set_width,
        overflow: "wrap",
        height: set_height,
        flexShrink: 0,
        flexGrow: 0,
      }}
      key={text}
    >
      {`${text}`}
    </p>
  );
};

const add_row_to_table = (
  current_samples: Node[],
  gisaid_records: GISAIDRecord[],
  home_geo: {
    location: string;
    division: string;
    country: string;
  },
  specificity: "location" | "division" | "country" | "global",
  label: string,
  set_width: string = "200",
  set_height: string = "50"
) => {
  const recency_options = [28, 84, 364, 36400];
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
      {add_text_cell(label, set_width, set_height)}
      {recency_options.map((recency) =>
        add_counts_cell(
          current_samples,
          gisaid_records,
          home_geo,
          specificity,
          recency,
          set_width,
          set_height
        )
      )}
    </div>
  );
};

interface SampleTableProps {
  gisaid_census: GISAIDRecord[];
  all_samples: Array<Node>;
  clade_description: CladeDescription;
}

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function SampleDistributionTable(props: SampleTableProps) {
  const { all_samples, gisaid_census, clade_description } = props;
  const specificity_options = ["location", "division", "country", "global"];

  const row_labels = {
    location: clade_description["home_geo"]["location"],
    division: "Other CA counties",
    country: "Other U.S. states",
    global: "Other countries",
  };

  const column_labels = [
    "Location",
    "Last 4 weeks",
    "Last 3 months",
    "Last 1 year",
    "Total",
  ];

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
        {column_labels.map((t) => add_text_cell(t, "10", "50"))}
      </div>
      {specificity_options.map((s) =>
        add_row_to_table(
          all_samples,
          gisaid_census,
          clade_description.home_geo,
          s,
          row_labels[s],
          "200",
          "50"
        )
      )}
    </div>
  );
}

export default SampleDistributionTable;
