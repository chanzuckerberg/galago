import { CladeDescription, Node } from "../../d";
import { FormatDate } from "../formatters/date";
import { FormatDataPoint } from "../formatters/dataPoint";
import { MiniCladeDescription } from "./miniCladeDescription";
import { get_dist } from "../../utils/treeMethods";

type SitStatProps = {
  clade_description: CladeDescription;
  all_samples: Node[];
};

export const SitStat = (props: SitStatProps) => {
  const { clade_description, all_samples } = props;
  console.log("all samples", all_samples);

  const all_clade_samples: Node[] =
    clade_description.unselected_samples_in_cluster
      .concat(clade_description.selected_samples)
      .sort(
        (a, b) =>
          a.node_attrs.num_date.value.getTime() -
          b.node_attrs.num_date.value.getTime()
      );

  const local_samples = all_clade_samples.filter(
    (n: Node) =>
      n.node_attrs.location.value === clade_description.home_geo.location
  );
  const external_samples = all_clade_samples.filter(
    (n: Node) =>
      n.node_attrs.location.value !== clade_description.home_geo.location
  );
  const clade_tree_proportion: number =
    (all_clade_samples.length * 100) / all_samples.length;

  const mrca_distances: { [key: string]: number } = Object.fromEntries(
    clade_description.selected_samples
      .concat(clade_description.unselected_samples_in_cluster)
      .map((x) => [
        x.name,
        clade_description.mrca ? get_dist([x, clade_description.mrca]) : NaN,
      ])
  );
  const n_mrca_matches: number = Object.keys(mrca_distances).filter(
    (m) => mrca_distances[m] === 0
  ).length;
  const n_tertiary_cases: number = Object.keys(mrca_distances).filter(
    (m) => mrca_distances[m] > clade_description.muts_per_trans_minmax[1]
  ).length;
  //@ts-ignore
  const dates: [Date, string, number][] = [
    [
      clade_description.mrca.node_attrs.num_date.value,
      " - Primary case (upstream of all samples in this clade)",
      0,
    ],
    [
      clade_description.selected_samples[0].node_attrs.num_date.value,
      " - Earliest selected sample",
      1,
    ],
    [
      local_samples[0].node_attrs.num_date.value,
      ` - Earliest sample from ${clade_description.home_geo.location} in this clade`,
      2,
    ],
    [
      local_samples.slice(-1)[0].node_attrs.num_date.value,
      ` - Most recent sample from ${clade_description.home_geo.location} in this clade`,
      3,
    ],
    [
      clade_description.selected_samples.slice(-1)[0].node_attrs.num_date.value,
      " - Most recent selected sample",
      4,
    ],
  ].sort((a, b) =>
    //@ts-ignore
    a[0].getTime() === b[0].getTime()
      ? //@ts-ignore
        a[2] - b[2]
      : //@ts-ignore
        a[0].getTime() - b[0].getTime()
  );

  return (
    <div>
      <h2>Summary (genomic situation status)</h2>
      <p style={{ fontStyle: "italic" }}>
        When assessing a potential outbreak using a phylogenetic tree, we look
        for the smallest hierarchical cluster ("clade") in the tree that
        contains all of your selected samples.
      </p>
      <h5>About this cluster ("clade")</h5>
      <MiniCladeDescription
        clade_description={clade_description}
        clade_tree_proportion={clade_tree_proportion}
      />
      <h5>Census of samples in this clade</h5>
      <ul>
        <li>
          <FormatDataPoint value={clade_description.selected_samples.length} />{" "}
          selected samples
        </li>
        <li>
          <FormatDataPoint
            value={
              all_clade_samples.filter(
                (n: Node) =>
                  n.node_attrs.location.value ===
                  clade_description.home_geo.location
              ).length
            }
          />{" "}
          total samples from {clade_description.home_geo.location} in this clade
        </li>
        <li>
          <FormatDataPoint
            value={
              all_clade_samples.filter(
                (n: Node) =>
                  n.node_attrs.location.value !==
                  clade_description.home_geo.location
              ).length
            }
          />{" "}
          total samples from other locations in this clade
        </li>
      </ul>
      <p className="results">
        Of all the samples in this cluster,{" "}
        <FormatDataPoint value={n_mrca_matches} /> have identical viral genomes
        to the primary case; <FormatDataPoint value={n_tertiary_cases} /> likely
        represent onward transmission (at least tertiary cases).
      </p>
      <h5>Timeline</h5>
      <ul>
        {dates.map((d) => (
          <li key={d[1]}>
            <FormatDate date={d[0]} />
            {d[1]}{" "}
          </li>
        ))}
      </ul>
    </div>
  );
};
