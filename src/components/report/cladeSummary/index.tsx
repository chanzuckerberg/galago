import { Node } from "../../../d";
import { FormatDate } from "../../formatters/date";
import { FormatDataPoint } from "../../formatters/dataPoint";
import { MiniCladeDescription } from "./miniCladeDescription";
import { EpiCurve } from "../../viz/epiCurve";
import { get_dist } from "../../../utils/treeMethods";
import { useSelector } from "react-redux";
import ContingencyTable from "../../viz/contingencyTable";

export const SitStat = () => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const cladeDescription = state.cladeDescription;

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

  // const clade_tree_proportion: number =
  //   (all_clade_samples.length * 100) / all_samples.length;

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
      <h5>Census of samples in this clade</h5>
      <ul>
        {state.samplesOfInterest.length > 0 && (
          <li>
            <FormatDataPoint value={cladeDescription.selected_samples.length} />{" "}
            selected samples
          </li>
        )}
        <li>
          <FormatDataPoint value={local_samples.length} /> total samples from{" "}
          {cladeDescription.home_geo.location} in this clade
        </li>
        <li>
          <FormatDataPoint
            value={all_clade_samples.length - local_samples.length}
          />{" "}
          total samples from other locations in this clade
        </li>
      </ul>
      {state.samplesOfInterest.length > 0 && <ContingencyTable />}

      <p className="results">
        Of all the samples in this cluster,{" "}
        <FormatDataPoint value={n_mrca_matches} /> have identical viral genomes
        to the primary case; <FormatDataPoint value={n_tertiary_cases} /> likely
        represent onward transmission (at least tertiary cases).
      </p>
      <h5>Timeline</h5>
      <p>
        The primary case (upstream of all the samples in this clade) most likely
        existed around{" "}
        <FormatDate date={cladeDescription.mrca.node_attrs.num_date.value} />{" "}
        (95% CI{" "}
        <FormatDate
          date={cladeDescription.mrca.node_attrs.num_date.confidence[0]}
        />{" "}
        -{" "}
        <FormatDate
          date={cladeDescription.mrca.node_attrs.num_date.confidence[1]}
        />
        ).
      </p>
    </div>
  );
};
