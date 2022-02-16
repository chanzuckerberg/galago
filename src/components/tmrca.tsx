import { CladeDescription, Node } from "../d";
import { get_dist } from "../utils/treeMethods";
import Sidenote from "./sidenote";

type CladeProps = {
  clade_description: CladeDescription;
};

function TMRCA(props: CladeProps) {
  const { clade_description } = props;

  const all_samples: Node[] = clade_description.selected_samples.concat(
    clade_description.unselected_samples_in_cluster
  );

  let mrca_distances: Object = Object.fromEntries(
    all_samples.map((x) => [
      x.name,
      clade_description.mrca ? get_dist([x, clade_description.mrca]) : NaN,
    ])
  );
  let mrca_matches: string[] = Object.keys(mrca_distances).filter(
    (m: string) => mrca_distances[m] === 0
  );
  return (
    <div>
      <h2>
        What was the date and genotype of the primary case upstream of this
        clade?
      </h2>
      <Sidenote
        num={3}
        text="You  may also hear this referred to as the 'most recent common ancestor (MRCA)' of a clade."
      />
      <p style={{ fontStyle: "italic" }}>
        We can use the tree to make inferences about the timing and genotype of
        the primary case <sup style={{ fontSize: "10" }}>3</sup>
        upstream of all the samples in our clade of interest.
      </p>

      <div className="results">
        <p>
          This clade's primary case likely occurred{" "}
          <span className="dataPoint">
            {clade_description.mrca &&
            clade_description.mrca.node_attrs.num_date.confidence.length === 2
              ? `between ${clade_description.mrca.node_attrs.num_date.confidence[0]
                  .toISOString()
                  .substring(
                    0,
                    10
                  )} and ${clade_description.mrca.node_attrs.num_date.confidence[1]
                  .toISOString()
                  .substring(0, 10)} (95% CI)`
              : ` around ${clade_description.mrca.node_attrs.num_date.value
                  .toISOString()
                  .substring(0, 10)}`}
          </span>
        </p>
      </div>
      <Sidenote
        num="4"
        text={
          <span>
            Learn more about{" "}
            <a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#temporally-resolved-phylogenetic-trees.">
              inferring dates using phylogenetic trees
            </a>{" "}
            and{" "}
            <a href="https://alliblk.github.io/genepi-book/broad-use-cases-for-genomic-epidemiology.html#estimating-the-start-and-duration-of-an-outbreak.">
              how sampling may effect these estimates.
            </a>
          </span>
        }
      />
      <p>
        Because pathogens evolve and spread on similar timescales, the number of
        mutations is proportionate to the amount of time separating two samples
        <sup style={{ fontSize: "10" }}>4</sup>.
      </p>
      <div className="results">
        <p>
          The primary case's pathogen genome sequence{" "}
          {mrca_matches.length === 0 ? (
            "does not match any samples in this dataset."
          ) : (
            <>
              {`was most likely identical to sample(s): `}
              {mrca_matches.map((m) => (
                <span className="dataPoint">{m}</span>
              ))}
              . Importantly, it is also possible that the true primary case is
              not be represented in this dataset (but has an identical sequence
              to these sample(s)).
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default TMRCA;
