import { Node, GISAIDRecord, CladeDescription } from "../../d";
import {
  HomeGeo,
  RecencyValues,
  FlattenedAttrs,
  SpecificityLevels,
  filter_tally,
  get_current_counts,
  get_gisaid_counts,
} from "../../utils/countSamples";

import TableRow from "./row";
import TextCell from "./textCell";

interface SampleTableProps {
  gisaid_census: GISAIDRecord[];
  all_samples: Array<Node>;
  clade_description: CladeDescription;
}

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function SampleDistributionTable(props: SampleTableProps) {
  const { all_samples, gisaid_census, clade_description } = props;
  const specificity_options: Array<SpecificityLevels> = [
    "location",
    "division",
    "country",
    "global",
  ];

  const row_labels = {
    location: clade_description["home_geo"]["location"],
    division: "Other CA counties",
    country: "Other U.S. states",
    global: "Other countries",
  };

  const column_labels = [
    "",
    "Last 4 weeks",
    "Last 3 months",
    "Last 1 year",
    "Total",
  ];

  return (
    <div // actual table container
      style={{
        position: "relative",
        borderTop: "1px solid black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "space-between",
        width: 960,
        marginTop: "3em",
        marginBottom: "3em",
      }}
    >
      <div // Top labels
        style={{
          display: "flex",
          flexDirection: "row",
          margin: 0,
          padding: 0,
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        {column_labels.map((t, i) => (
          <TextCell text={t} key={i} />
        ))}
      </div>
      {specificity_options.map((s, i) => (
        <TableRow
          current_samples={all_samples}
          gisaid_records={gisaid_census}
          home_geo={clade_description.home_geo}
          specificity={s}
          label={row_labels[s]}
          key={i}
        />
      ))}
    </div>
  );
}

export default SampleDistributionTable;
