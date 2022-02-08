import { CladeDescription, Node } from "../d";
import { get_dist } from "../utils/treeMethods";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function TMRCA(props: CladeProps) {
  const { data } = props;

  const all_samples: Node[] = data.selected_samples.concat(
    data.unselected_samples_in_cluster
  );

  let mrca_distances: Object = Object.fromEntries(
    all_samples.map((x) => [x.name, data.mrca ? get_dist([x, data.mrca]) : NaN])
  );
  let mrca_matches: string[] = Object.keys(mrca_distances).filter(
    (m: string) => mrca_distances[m] === 0
  );

  return (
    <div>
      <h2>When did this clade arise?</h2>
      <div className="results">
        <p>
          {/*TODO: show muts from parent? or shortest path from sample in cluster -> nearest cousin?*/}
          <>
            This clade's primary case likely occurred{" "}
            <span className="dataPoint">
              {data.mrca &&
              data.mrca.node_attrs.num_date.confidence.length === 2
                ? `between ${data.mrca.node_attrs.num_date.confidence[0]
                    .toISOString()
                    .substring(
                      0,
                      10
                    )} and ${data.mrca.node_attrs.num_date.confidence[1]
                    .toISOString()
                    .substring(0, 10)} (95% CI).`
                : ` around ${data.mrca.node_attrs.num_date.value
                    .toISOString()
                    .substring(0, 10)}`}
            </span>
          </>
        </p>
        <p>
          The primary case's pathogen genome sequence
          {mrca_matches.length === 0
            ? "does not match any samples in this dataset."
            : `was most likely identical to sample(s): ${mrca_matches}. Importantly, it is also possible that the true primary case is not be represented in this dataset (but has an identical sequence to these sample(s)). `}
        </p>
      </div>
      <p>
        Learn more about{" "}
        <a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#temporally-resolved-phylogenetic-trees.">
          inferring dates using phylogenetic trees
        </a>{" "}
        and{" "}
        <a href="https://alliblk.github.io/genepi-book/broad-use-cases-for-genomic-epidemiology.html#estimating-the-start-and-duration-of-an-outbreak.">
          how sampling may effect these estimates.
        </a>
      </p>
    </div>
  );
}

export default TMRCA;
