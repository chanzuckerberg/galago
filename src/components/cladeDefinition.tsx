import { CladeDescription, Node } from "../d";
import Sidenote from "./sidenote";

interface CladeDefinitionProps {
  clade_description: CladeDescription;
}

function CladeDefinition(props: CladeDefinitionProps) {
  const { clade_description } = props;
  const local_unselected_samples: Node[] =
    clade_description.unselected_samples_in_cluster.filter(
      (n) => n.node_attrs.location.value == clade_description.home_geo.location
    );

  const other_locations: Array<string> = [
    ...new Set(
      clade_description.unselected_samples_in_cluster
        .map((a) => a.node_attrs.location.value)
        .sort()
    ),
  ].sort();

  // let lineage_counts = {};
  // clade_description.selected_samples.forEach((s) => {
  //   let lin = s.node_attrs.pango_lineage?.value;
  //   if (lin) {
  //     lineage_counts[lin] = 1 + (lineage_counts[lin] || 0);
  //   }
  // });
  let lineages = Array.from(
    new Set(
      clade_description.selected_samples
        .concat(clade_description.unselected_samples_in_cluster)
        .map((s) => s.node_attrs.pango_lineage?.value || s.node_attrs.clade)
    )
  ).sort();

  return (
    <div>
      <h2>How closely related are your selected samples to each other?</h2>

      <p style={{ fontStyle: "italic" }}>
        Trees give us two ways to consider relatedness: mutations and
        hierarchical clustering.
      </p>
      <h5>Mutations:</h5>
      <p>
        We can use the average number of mutations per serial interval to get a
        rough estimate of the number of transmission events separating two
        samples.
      </p>
      <p className="results">
        Your
        <span className="dataPoint">
          {clade_description.selected_samples.length}
        </span>{" "}
        selected samples are separated from each other by{" "}
        <span className="dataPoint">
          {clade_description.muts_bn_selected_minmax[0]} -{" "}
          {clade_description.muts_bn_selected_minmax[1]}
        </span>{" "}
        mutations (or, on average, about{" "}
        <span className="dataPoint">
          {clade_description.muts_bn_selected_minmax[0] *
            clade_description.muts_per_trans_minmax[0]}{" "}
          -{" "}
          {clade_description.muts_bn_selected_minmax[1] *
            clade_description.muts_per_trans_minmax[1]}
        </span>{" "}
        transmission events).
      </p>

      <h5>Hierarchical clustering ("clades"):</h5>
      <p>
        <Sidenote
          num={2}
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
        A 'clade' is the smallest hierarchical cluster (or 'subtree') that
        contains all of your samples of interest.
        <sup style={{ fontSize: "10" }}>2</sup> This means that all of the
        samples within a clade are more closely related to each other than they
        are to anything else in the dataset.
      </p>

      <p className="results">
        {clade_description.unselected_samples_in_cluster.length == 0 ? (
          `Your selected samples form their own clade without any other samples from this dataset.`
        ) : (
          <>
            In addition to your selected samples, the clade containing your
            samples also contains{" "}
            <span className="dataPoint">
              {clade_description.unselected_samples_in_cluster.length}
            </span>{" "}
            other samples from these locations:{" "}
            <span className="dataPoint">{other_locations}</span>.
          </>
        )}
      </p>
      <p className="results">
        {local_unselected_samples.length === 0 ? (
          ""
        ) : (
          <>
            This includes{" "}
            <span className="dataPoint">{local_unselected_samples.length}</span>{" "}
            other samples from {clade_description.home_geo.location}:{" "}
            {local_unselected_samples.map((s) => (
              <span className="dataPoint">{s.name}</span>
            ))}
          </>
        )}
      </p>
      <h5>Lineages ("variants")</h5>
      <p>
        "Lineages" or "variants" are special clades that the scientific
        community has decided to label for ease of discussion.{" "}
        <Sidenote
          num={3}
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
        This clade contains samples that are part of these lineage(s):{" "}
        {lineages.map((l) => (
          <span className="dataPoint">{l}</span>
        ))}
      </p>
    </div>
  );
}
export default CladeDefinition;
