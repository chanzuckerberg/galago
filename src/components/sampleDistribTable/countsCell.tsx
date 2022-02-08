import { Node, GISAIDRecord } from "../../d";
import {
  HomeGeo,
  RecencyValues,
  SpecificityLevels,
  get_current_counts,
  get_gisaid_counts,
} from "../../utils/countSamples";

type CountsCellProps = {
  current_samples: Node[];
  gisaid_records: GISAIDRecord[];
  home_geo: HomeGeo;
  specificity_level: SpecificityLevels;
  recency: RecencyValues;
};

const CountsCell = (props: CountsCellProps) => {
  const {
    current_samples,
    home_geo,
    specificity_level,
    recency,
    gisaid_records,
  } = props;

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
        width: 120,
        textAlign: "right",
        fontSize: 12,
        fontFamily:
          "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
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

export default CountsCell;
