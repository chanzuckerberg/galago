import { Node, GISAIDRecord, CladeDescription } from "../../d";
import {
  HomeGeo,
  RecencyValues,
  SpecificityLevels,
} from "../../utils/countSamples";

import TextCell from "./textCell";
import CountsCell from "./countsCell";

const TableRow = (props: {
  current_samples: Node[];
  gisaid_records: GISAIDRecord[];
  home_geo: HomeGeo;
  specificity: SpecificityLevels;
  label: string;
}) => {
  const { current_samples, gisaid_records, home_geo, specificity, label } =
    props;
  const recency_options: RecencyValues[] = [28, 84, 364, 36400];
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
      <TextCell text={label} />
      {recency_options.map((recency, i) => (
        <CountsCell
          current_samples={current_samples}
          gisaid_records={gisaid_records}
          home_geo={home_geo}
          specificity_level={specificity}
          recency={recency}
          key={i}
        />
      ))}
    </div>
  );
};

export default TableRow;
