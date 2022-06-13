import { Node, GISAIDRecord, CladeDescription } from "../../../d";
import { GeoLevels } from "../../../utils/countSamples";
import { DataLevels } from "./table";

import TextCell from "./textCell";
import CountsCell from "./countsCell";

const TableRow = (props: {
  gisaidCounts: Array<GISAIDRecord>;
  geoLevel: GeoLevels;
  label: string;
  key: any;
  minMonth: number;
  minYear: number;
  maxMonth: number;
  maxYear: number;
}) => {
  const {
    gisaidCounts,
    geoLevel,
    label,
    key,
    minMonth,
    minYear,
    maxMonth,
    maxYear,
  } = props;
  const dataLevels: Array<DataLevels> = ["gisaid", "dataset", "clade"];

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
      {dataLevels.map((dl, i) => (
        <CountsCell
          gisaidCounts={gisaidCounts}
          geoLevel={geoLevel}
          dataLevel={dl}
          minMonth={minMonth}
          minYear={minYear}
          maxMonth={maxMonth}
          maxYear={maxYear}
        />
      ))}
    </div>
  );
};

export default TableRow;
