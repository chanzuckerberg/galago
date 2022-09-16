import { Node, GISAIDRecord, HomeGeo } from "../../../d";
import { GeoLevels, getCount } from "../../../utils/countSamples";
import { useSelector } from "react-redux";
import { get_leaves, traverse_preorder } from "../../../utils/treeMethods";
import { DataLevels } from "./table";

type CountsCellProps = {
  gisaidRecords: GISAIDRecord[];
  geoLevel: GeoLevels;
  dataLevel: DataLevels;
  minDate: Date;
  maxDate: Date;
  key: string;
};

const CountsCell = (props: CountsCellProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const { gisaidRecords, geoLevel, dataLevel, minDate, maxDate, key } = props;

  let data, count;

  switch (dataLevel) {
    case "gisaid": {
      data = gisaidRecords;
      count = getCount(
        "gisaid",
        geoLevel,
        state.cladeDescription.home_geo,
        minDate,
        maxDate,
        data
      );
    }
    case "dataset": {
      data = get_leaves(state.tree);
      count = getCount(
        "node",
        geoLevel,
        state.cladeDescription.home_geo,
        minDate,
        maxDate,
        undefined,
        data
      );
    }
    case "clade": {
      data = get_leaves(state.mrca);
      count = getCount(
        "node",
        geoLevel,
        state.cladeDescription.home_geo,
        minDate,
        maxDate,
        undefined,
        data
      );
    }
  }

  return (
    <p
      style={{
        width: 120,
        textAlign: "right",
        fontSize: 12,
        fontFamily:
          "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
      }}
      key={key}
    >
      {count.toLocaleString("en-US")}
    </p>
  );
};

export default CountsCell;
