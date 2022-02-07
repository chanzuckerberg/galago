import { Node, GISAIDRecord, CladeDescription } from "../d";
import {
  HomeGeo,
  RecencyValues,
  FlattenedAttrs,
  SpecificityLevels,
  filter_tally,
  get_current_counts,
  get_gisaid_counts,
} from "../../utils/countSamples";

const add_counts_cell = (
  current_samples: Node[],
  gisaid_records: GISAIDRecord[],
  home_geo: HomeGeo,
  specificity_level: SpecificityLevels,
  recency: RecencyValues,
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
  home_geo: HomeGeo,
  specificity: SpecificityLevels,
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
