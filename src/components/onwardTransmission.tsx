import { CladeDescription, Node } from "../d";
import { get_dist } from "../utils/treeMethods";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function OnwardTransmission(props: CladeProps) {
  const { data } = props;
  const all_samples: Node[] = data.selected_samples.concat(
    data.unselected_samples_in_cluster
  );

  let mrca_distances: Object = Object.fromEntries(
    all_samples.map((x) => [x.name, data.mrca ? get_dist([x, data.mrca]) : NaN])
  );

  return (
    <div>
      <h2>How much onward transmission have we observed?</h2>
      <div className="results">
        <p>
          {/*TODO: show muts from parent? or shortest path from sample in cluster -> nearest cousin?*/}
          {`In this clade, ${
            Object.values(mrca_distances).filter((n) => n === 0).length
          } sample(s) are identical to the primary case and ${
            Object.values(mrca_distances).filter(
              (n) => n > data.muts_per_trans_minmax[1]
            ).length
          } sample(s) are most likely tertiary cases`}
        </p>
      </div>
      <p>
        Differentiating between a superspreader event (where one primary cases
        transmits to many secondary cases) and onward transmission (here,
        defined as tertiary or further downstream cases), can be tricky.
        Mutations occur as a pathogen replicates within the host's body, which
        means that any individual case has multiple pathogen genotypes present
        in their body. Usually, a primary case transmits one dominant pathogen
        genotype to all of their secondary cases.
      </p>
      <p>
        Sometimes you may observe a few different genotypes which vary by 1 -{" "}
        <span className="dataPoint">{data.muts_per_trans_minmax[1]}</span>{" "}
        mutations being transmitted during the same superspreader event.
      </p>
      <p>
        As a rule of thumb, we generally consider it unlikely for samples which
        are identical to the primary case to be the result of onward
        transmission.
      </p>
      <p>
        Samples with 1 -{" "}
        <span className="dataPoint">{data.muts_per_trans_minmax[1]}</span>{" "}
        mutations may either be secondary cases or further downstream.
      </p>
      <p>
        {`It's usually a reasonable to assume that samples with 
        ${
          data.muts_per_trans_minmax[1] + 1
        }+ mutations represent tertiary or further
        downstream transmission.`}
      </p>
      <p>
        Learn more about{" "}
        <a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#how-many-mutations-are-enough-to-rule-linkage-out">
          ruling out direct linkage
        </a>{" "}
        and{" "}
        <a href="https://alliblk.github.io/genepi-book/broad-use-cases-for-genomic-epidemiology.html#assessing-linkage-between-cases">
          more generally assessing linkage patterns between cases.
        </a>
      </p>
    </div>
  );
}

export default OnwardTransmission;
