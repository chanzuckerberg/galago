import { Node } from "../../../d";
import { FormatDate } from "../../formatters/date";
import { FormatDataPoint } from "../../formatters/dataPoint";
import { MiniCladeDescription } from "./miniCladeDescription";
import { EpiCurve } from "../../viz/epiCurve";
import { getNodeAttr, get_dist } from "../../../utils/treeMethods";
import { useSelector } from "react-redux";
import ContingencyTable from "../../viz/contingencyTable";
import { useWindowSize } from "@react-hook/window-size";

export const SitStat = () => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const cladeDescription = state.cladeDescription;
  const [windowWidth, windowHeight] = useWindowSize();

  const all_clade_samples: Node[] =
    cladeDescription.unselected_samples_in_cluster
      .concat(cladeDescription.selected_samples)
      .sort(
        (a: Node, b: Node) =>
          a.node_attrs.num_date.value.getTime() -
          b.node_attrs.num_date.value.getTime()
      );

  const local_samples = all_clade_samples.filter(
    (n: Node) =>
      n.node_attrs.location.value === cladeDescription.home_geo.location
  );

  const mrca_distances: { [key: string]: number } = Object.fromEntries(
    cladeDescription.selected_samples
      .concat(cladeDescription.unselected_samples_in_cluster)
      .map((x: any) => [
        x.name,
        cladeDescription.mrca ? get_dist([x, cladeDescription.mrca]) : NaN,
      ])
  );
  const n_mrca_matches: number = Object.keys(mrca_distances).filter(
    (m) => mrca_distances[m] === 0
  ).length;
  const n_tertiary_cases: number = Object.keys(mrca_distances).filter(
    (m) => mrca_distances[m] > cladeDescription.muts_per_trans_minmax[1]
  ).length;

  return (
    <div>
      <h2>Genomic summary of your selected clade</h2>
      <p style={{ fontStyle: "italic" }}>
        A "clade" is a hierarchical cluster in a phylogenetic tree.
      </p>
      <h5>About this cluster ("clade")</h5>
      <MiniCladeDescription />
      <h5>Timeline</h5>
      <EpiCurve
        chartHeight={windowWidth * 0.15}
        chartWidth={windowWidth * 0.35}
        chartMargin={60}
      />
      {!isNaN(getNodeAttr(cladeDescription.mrca, "num_date")) && (
        <span
          style={{
            fontWeight: "bold",
            fontSize: 12,
            color: "#4f2379",
          }}
        >
          * The primary case most likely existed around{" "}
          <FormatDate date={cladeDescription.mrca.node_attrs.num_date.value} />{" "}
        </span>
      )}
      {/* <span style={{ fontSize: 12 }}>
        {" "}
        (95% CI{" "}
        <FormatDate
          date={cladeDescription.mrca.node_attrs.num_date.confidence[0]}
        />{" "}
        -{" "}
        <FormatDate
          date={cladeDescription.mrca.node_attrs.num_date.confidence[1]}
        />
        ).
      </span> */}
      {state.samplesOfInterest.length > 0 && (
        <>
          <h5>
            How good is the overlap of your Samples of Interest and this clade?
          </h5>
          <ContingencyTable />
        </>
      )}
    </div>
  );
};
