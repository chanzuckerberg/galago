import { CladeDescription, Node } from "../d";
import Sidenote from "./sidenote";
import { FormatStringArray } from "./formatters/stringArray";
import { FormatDate } from "./formatters/date";
import { FormatDataPoint } from "./formatters/dataPoint";
import { useSelector } from "react-redux";
import { getNodeAttr } from "../utils/treeMethods";

interface CladeDefinitionProps {
  sidenote_start: number;
}

function CladeDefinition(props: CladeDefinitionProps) {
  const { sidenote_start } = props;
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const cladeDescription = state.cladeDescription;

  const all_samples = cladeDescription.selected_samples.concat(
    cladeDescription.unselected_samples_in_cluster
  );
  const all_local_samples = all_samples.filter(
    (n: Node) =>
      getNodeAttr(n, "location") == cladeDescription.home_geo.location
  );

  // let lineage_counts = {};
  // cladeDescription.selected_samples.forEach((s) => {
  //   let lin = s.node_attrs.pango_lineage?.value;
  //   if (lin) {
  //     lineage_counts[lin] = 1 + (lineage_counts[lin] || 0);
  //   }
  // });

  return (
    <div>
      <h2>How closely related are your selected samples to each other?</h2>

      <p style={{ fontStyle: "italic" }}>
        Trees give us two ways to consider relatedness: mutations and
        hierarchical clustering.
      </p>
      <h5>Mutations:</h5>
      <p>
        We can use the average number of mutations per serial interval (
        {
          <FormatDataPoint
            value={`${state.cladeDescription.muts_per_trans_minmax[0]} - ${state.cladeDescription.muts_per_trans_minmax[1]}`}
          />
        }
        ) to get a rough estimate of the number of transmissions separating two
        samples.
      </p>
      <p className="results">{/* Put heatmap here */}</p>

      <h5>Hierarchical clustering ("clades"):</h5>
      <p>
        <Sidenote
          num={sidenote_start}
          text={
            <span>
              This is conceptually similar to your family tree: the branching
              patterns show us that you are more closely related to your
              siblings than to your cousins, and that you are more closely
              related to your cousins than to a stranger.{" "}
              <a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#what-is-a-phylogenetic-tree">
                Learn more about 'clades.'
              </a>
            </span>
          }
        />
        A 'clade' is a hierarchical cluster (or 'subtree') in a phylogenetic
        tree.
        <sup style={{ fontSize: "10" }}>{sidenote_start}</sup> By definition,
        all of the samples within a clade are more closely related to each other
        than they are to anything else in the dataset.
      </p>

      <p className="results">
        This clade contains{" "}
        {
          <FormatDataPoint
            value={
              cladeDescription.selected_samples.length +
              cladeDescription.unselected_samples_in_cluster.length
            }
          />
        }{" "}
        total samples.
        {/* if the user has specified samples of interest, give the makeup of 'interesting' vs 'other' samples in this clade */}
        {cladeDescription.selected_samples && // we have samples of interest -- and no other samples -- in this clade
          !cladeDescription.unselected_samples_in_cluster &&
          ` Your selected samples form their own clade without any other samples from this dataset.`}
        {cladeDescription.selected_samples && // mix of both samples of interest and other samples in this clade
          cladeDescription.unselected_samples_in_cluster &&
          ` This includes ${(
            <FormatDataPoint
              value={`${cladeDescription.selected_samples.length}`}
            />
          )} of your samples of interest and ${(
            <FormatDataPoint
              value={`${cladeDescription.unselected_samples_in_cluster.length}`}
            />
          )} other samples.`}
      </p>

      <p className="results">
        The samples in this clade are from these locations:
        <FormatStringArray
          values={cladeDescription.unselected_samples_in_cluster
            .concat(cladeDescription.selected_samples)
            .map((n: Node) => getNodeAttr(n, "location"))}
        />
        {all_local_samples && (
          <>
            The <FormatDataPoint value={all_local_samples.length} />
            samples from {cladeDescription.home_geo.location} are:
            <FormatStringArray values={all_local_samples.map((s) => s.name)} />
          </>
        )}
      </p>
      <h5>Lineages ("variants")</h5>
      <p>
        "Lineages" or "variants" are special clades that the scientific
        community has decided to label for ease of discussion.{" "}
        <Sidenote
          num={sidenote_start + 1}
          text={
            <span>
              <a href="https://cov-lineages.org/lineage_list.html">
                Learn more about these lineages.
              </a>
            </span>
          }
        />
      </p>
      <p className="results">
        This clade contains samples that are part of these lineage(s):
        <sup style={{ fontSize: "10" }}>{sidenote_start + 1}</sup>
        <FormatStringArray
          values={cladeDescription.selected_samples
            .concat(cladeDescription.unselected_samples_in_cluster)
            .map(
              (s: Node) =>
                s.node_attrs.pango_lineage?.value ||
                s.node_attrs.clade_membership?.value
            )}
        />
      </p>
    </div>
  );
}
export default CladeDefinition;
