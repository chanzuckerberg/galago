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
      clade_description.unselected_samples_in_cluster.map(
        (a) => a.node_attrs.location.value
      )
    ),
  ].sort();
  return (
    <div>
      <h2>How closely related are your selected samples to each other?</h2>

      <p style={{ fontStyle: "italic" }}>
        Trees give us two ways to consider relatedness: mutations and
        hierarchical clustering.
      </p>
      <div>
        <h5>Mutations:</h5>
        <p>
          We can use the average number of mutations per serial interval to get
          a rough estimate of the number of transmission events separating two
          samples.
        </p>
        <div className="results">
          <p>
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
        </div>
      </div>
      <Sidenote
        num={2}
        text={
          <span>
            This is conceptually similar to your family tree: the branching
            patterns show us that you are more closely related to your siblings
            than to your cousins, and that you are more closely related to your
            cousins than to a stranger.{" "}
            <a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#what-is-a-phylogenetic-tree">
              Learn more about 'clades.'
            </a>
          </span>
        }
      />
      <div>
        <h5>Hierarchical clustering ("clades"):</h5>
        <p>
          A 'clade' is the smallest hierarchical cluster (or 'subtree') that
          contains all of your selected samples. This means that all of the
          samples within a clade are more closely related to each other than
          they are to anything else in the dataset.
          <sup style={{ fontSize: "10" }}>2</sup>
        </p>

        <div className="results">
          <p>
            {clade_description.unselected_samples_in_cluster.length == 0
              ? `Your selected samples form their own clade without any other samples from this dataset.`
              : `The clade containing your samples also contains ${clade_description.unselected_samples_in_cluster.length} samples from these locations: ${other_locations}.`}
          </p>
          <p>
            {`${
              local_unselected_samples.length === 0
                ? ``
                : `This includes ${
                    local_unselected_samples.length
                  } other samples from ${
                    clade_description.home_geo.location
                  }: ${local_unselected_samples.map((s) => s.name)}`
            }`}
          </p>
        </div>
      </div>
    </div>
  );
}
export default CladeDefinition;
