import { Node, GISAIDRecord, HomeGeo } from "../../d";
import {
  GeoLevels,
  getGisaidCounts,
  getNodeCounts,
} from "../../utils/countSamples";
import { useSelector } from "react-redux";
import { get_leaves } from "../../utils/treeMethods";
import { DataLevels } from "./table";

type CountsCellProps = {
  gisaidCounts: GISAIDRecord[];
  geoLevel: GeoLevels;
  dataLevel: DataLevels;
  minMonth: number;
  minYear: number;
  maxMonth: number;
  maxYear: number;
};

const CountsCell = (props: CountsCellProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const {
    gisaidCounts,
    geoLevel,
    dataLevel,
    minYear,
    minMonth,
    maxYear,
    maxMonth,
  } = props;

  let counts = NaN;

  if (dataLevel === "gisaid") {
    counts = getGisaidCounts(
      gisaidCounts,
      geoLevel,
      state.cladeDescription.home_geo,
      minYear,
      minMonth,
      maxYear,
      maxMonth
    );
  } else if (dataLevel === "dataset") {
    counts = getNodeCounts(
      get_leaves(state.tree),
      geoLevel,
      state.cladeDescription.home_geo,
      minYear,
      minMonth,
      maxYear,
      maxMonth
    );
  } else {
    counts = getNodeCounts(
      get_leaves(state.mrca),
      geoLevel,
      state.cladeDescription.home_geo,
      minYear,
      minMonth,
      maxYear,
      maxMonth
    );
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
      key={`${dataLevel}+${geoLevel}`}
    >
      {counts.toLocaleString("en-US")}
    </p>
  );
};

export default CountsCell;
