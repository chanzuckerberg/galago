import { CladeDescription, Node } from "../d";
import { get_dist } from "../utils/treeMethods";
import Sidenote from "./sidenote";
import { FormatDataPoint } from "./formatters/dataPoint";
import { FormatDate } from "./formatters/date";
import { FormatStringArray } from "./formatters/stringArray";

type CladeProps = {
  clade_description: CladeDescription;
  sidenote_start: number;
};

function TMRCA(props: CladeProps) {
  const { clade_description, sidenote_start } = props;

  const all_samples: Node[] = clade_description.selected_samples.concat(
    clade_description.unselected_samples_in_cluster
  );

  let mrca_distances: { [key: string]: number } = Object.fromEntries(
    all_samples.map((x) => [
      x.name,
      clade_description.mrca ? get_dist([x, clade_description.mrca]) : NaN,
    ])
  );
  let mrca_matches: string[] = Object.keys(mrca_distances).filter(
    (m) => mrca_distances[m] === 0
  );
  return (
    <div>
      <h2>What was the date and genotype of the primary infection?</h2>
      <p>
        <Sidenote
          num={sidenote_start}
          text="You may also hear this referred to as the 'most recent common ancestor (MRCA)' of a clade."
        />
      </p>
      <p style={{ fontStyle: "italic" }}>
        We can use the tree to make inferences about the timing of the primary
        case -- and the genotype of the pathogen
        <sup style={{ fontSize: "10" }}>{sidenote_start}</sup> infecting them --
        upstream of all the samples in our clade of interest.
      </p>
      {mrca_matches.length === 0 ? (
        <p className="results">
          The primary case's pathogen genome sequence does not match any samples
          in this dataset.
        </p>
      ) : (
        <>
          <p className="results">
            The primay case's pathogen genome sequence was most likely identical
            to the pathogens found in sample(s):
            <FormatStringArray values={mrca_matches} />
          </p>
          <p>
            Importantly, it is also possible that the true primary case -- while
            identical to any samples listed above -- may not be represented in
            this dataset (e.g., if the primary case was not sampled, or if the
            sample from the primary case happened to contain a different
            within-host variant
            <sup style={{ fontSize: "10" }}>{sidenote_start + 1}</sup>).
            <Sidenote
              num={sidenote_start + 1}
              text={
                <span>
                  Learn more about{" "}
                  <a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#viral-diversity-accumulates-over-the-course-of-a-single-individuals-infection.">
                    Within-host pathogen diversity
                  </a>
                  .
                </span>
              }
            />
          </p>
        </>
      )}
      <p>
        <Sidenote
          num={sidenote_start + 2}
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
        Even if the true primary case is not represented by a sample in this
        dataset, because pathogens accumulate mutations at a steady rate over
        time, we can still infer the approximate date of the primary case
        <sup style={{ fontSize: "10" }}>{sidenote_start + 2}</sup>.
      </p>
      <div className="results">
        <p>
          This clade's primary case likely occurred
          {clade_description.mrca &&
          clade_description.mrca.node_attrs.num_date.confidence.length === 2 ? (
            <>
              {" "}
              between{" "}
              <FormatDate
                date={clade_description.mrca.node_attrs.num_date.confidence[0]}
              />{" "}
              and{" "}
              <FormatDate
                date={clade_description.mrca.node_attrs.num_date.confidence[1]}
              />
              (95% CI)
            </>
          ) : (
            <>
              around{" "}
              <FormatDate
                date={clade_description.mrca.node_attrs.num_date.value}
              />
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default TMRCA;
