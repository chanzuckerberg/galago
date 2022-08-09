import { CladeDescription, Node } from "../../d";
import { getNodeAttr, get_dist } from "../../utils/treeMethods";
import Sidenote from "../formatters/sidenote";
import { FormatDate } from "../formatters/date";
import { FormatStringArray } from "../formatters/stringArray";
import { useSelector } from "react-redux";

type CladeProps = {
  sidenote_start: number;
};

function TMRCA(props: CladeProps) {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const cladeDescription = state.cladeDescription;

  const { sidenote_start } = props;

  const all_samples: Node[] = cladeDescription.selected_samples.concat(
    cladeDescription.unselected_samples_in_cluster
  );

  let mrca_distances: { [key: string]: number } = Object.fromEntries(
    all_samples.map((x) => [
      x.name,
      cladeDescription.mrca ? get_dist([x, cladeDescription.mrca]) : NaN,
    ])
  );
  let mrca_matches: string[] = Object.keys(mrca_distances).filter(
    (m) => mrca_distances[m] === 0
  );
  return (
    <div className="reportSection">
      {state.haveInternalNodeDates ? (
        <h2>What was the date and genotype of the primary infection?</h2>
      ) : (
        <h2>What was the genotype of the primary infection?</h2>
      )}
      {state.haveInternalNodeDates ? (
        <p style={{ fontStyle: "italic" }}>
          We can use the tree to make inferences about the timing of the{" "}
          <Sidenote
            target={"primary case"}
            contents="You may also hear this referred to as the 'most recent common ancestor (MRCA)' of a clade."
          />{" "}
          -- and the genotype of the pathogen -- upstream of all the samples in
          our clade of interest.
        </p>
      ) : (
        <p style={{ fontStyle: "italic" }}>
          We can use the tree to make inferences about the genotype of the
          pathogen primary case -- upstream of all the samples in our clade of
          interest.
        </p>
      )}

      {mrca_matches.length === 0 ? (
        <p className="results">
          The primary case's pathogen genome sequence does not match any samples
          in this dataset.
        </p>
      ) : (
        <>
          {mrca_matches.length >= all_samples.length * 0.2 && (
            <p>
              Observing many identical samples is consistent with rapid
              transmission in high-incidence settings.
            </p>
          )}
          <p className="results">
            The primay case's pathogen genome sequence was most likely identical
            to the pathogens found in sample(s):
            <FormatStringArray values={mrca_matches} />
          </p>

          <p>
            Importantly, it is also <b>possible that the true primary case</b>{" "}
            -- while identical to any samples listed above --{" "}
            <b>may not be represented in this dataset</b> (e.g., if the primary
            case was not sampled, or if the sample from the primary case
            happened to contain a{" "}
            <Sidenote
              target={"different within-host variant."}
              contents={
                <span>
                  Learn more about{" "}
                  <a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#viral-diversity-accumulates-over-the-course-of-a-single-individuals-infection.">
                    Within-host pathogen diversity
                  </a>
                </span>
              }
            />
            ).
          </p>
        </>
      )}
      {state.haveInternalNodeDates && (
        <>
          <p>
            Even if the true primary case is not represented by a sample in this
            dataset, because pathogens{" "}
            <Sidenote
              target={`accumulate mutations at a steady rate
              over time`}
              contents={
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
            />{" "}
            over time, we can still infer the approximate date of the primary
            case.
          </p>
          <span className="results">
            <p>
              This clade's primary case likely occurred
              {cladeDescription.mrca &&
              cladeDescription.mrca.node_attrs.num_date.confidence.length ===
                2 ? (
                <>
                  {" "}
                  between{" "}
                  <FormatDate
                    date={
                      cladeDescription.mrca.node_attrs.num_date.confidence[0]
                    }
                  />{" "}
                  and{" "}
                  <FormatDate
                    date={
                      cladeDescription.mrca.node_attrs.num_date.confidence[1]
                    }
                  />
                  (95% CI)
                </>
              ) : (
                <>
                  around{" "}
                  <FormatDate
                    date={cladeDescription.mrca.node_attrs.num_date.value}
                  />
                </>
              )}
            </p>
          </span>
        </>
      )}
    </div>
  );
}

export default TMRCA;
