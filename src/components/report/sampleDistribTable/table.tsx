import { Node, GISAIDRecord, CladeDescription, HomeGeo } from "../../../d";
import { GeoLevels } from "../../../utils/countSamples";
import { useSelector } from "react-redux";
import TableRow from "./row";
import TextCell from "./textCell";

export type DataLevels = "gisaid" | "dataset" | "clade";

interface SampleTableProps {
  gisaidRecords: GISAIDRecord[];
  minDate: Date;
  maxDate: Date;
}

function SampleDistributionTable(props: SampleTableProps) {
  //@ts-ignore
  const state = useSelector((state) => state.global);

  const { gisaidRecords, minDate, maxDate } = props;
  const geoLevels: Array<GeoLevels> = ["location", "division", "country"];

  const row_labels = {
    location: state.location,
    division: `Other ${state.division} counties`,
    country: `Other ${state.country} states`,
  };

  const column_labels = ["", "All public data", "This dataset", "This clade"];

  return (
    <div // actual table container
      style={{
        position: "relative",
        borderTop: "1px solid black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "space-between",
        width: 550,
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
      {geoLevels.map((geo, i) => (
        <TableRow
          gisaidRecords={gisaidRecords}
          geoLevel={geo}
          label={row_labels[geo]}
          key={i}
          minDate={minDate}
          maxDate={maxDate}
        />
      ))}
    </div>
  );
}

export default SampleDistributionTable;
