import { GISAIDRecord } from "../../../d";
import { GeoLevels } from "../../../utils/countSamples";
import { DataLevels } from "./table";

import TextCell from "./textCell";
import CountsCell from "./countsCell";

//@ts-ignore
import uuid from "react-uuid";

type TableRowProps = {
  gisaidRecords: Array<GISAIDRecord>;
  geoLevel: GeoLevels;
  label: string;
  key: any;
  minDate: Date;
  maxDate: Date;
};

const TableRow = (props: TableRowProps) => {
  const { gisaidRecords, geoLevel, label, key, minDate, maxDate } = props;
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
      {dataLevels.map((dl) => (
        <CountsCell
          gisaidRecords={gisaidRecords}
          geoLevel={geoLevel}
          dataLevel={dl}
          minDate={minDate}
          maxDate={maxDate}
          key={`countsCell-${uuid()}`}
        />
      ))}
    </div>
  );
};

export default TableRow;
