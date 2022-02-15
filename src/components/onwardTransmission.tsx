import { CladeDescription, Node } from "../d";
import { get_dist } from "../utils/treeMethods";
import Sidenote from "./sidenote";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  clade_description: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND clade_description WITHIN THE TEXT AND UPDATE IT WHEN THE clade_description INPUT CHANGES
function OnwardTransmission(props: CladeProps) {
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

  return (
    <div>
      <h2>How much onward transmission have we observed?</h2>
      <div className="results">
        <p>
          {/*TODO: show muts from parent? or shortest path from sample in cluster -> nearest cousin?*/}
          In this clade,{" "}
          <span className="dataPoint">
            {Object.values(mrca_distances).filter((n) => n === 0).length}
          </span>{" "}
          sample(s) are identical to the primary case and{" "}
          <span className="dataPoint">
            {
              Object.values(mrca_distances).filter(
                (n) => n > clade_description.muts_per_trans_minmax[1]
              ).length
            }
          </span>{" "}
          sample(s) are most likely tertiary cases.
        </p>
      </div>
      <p>
        <Sidenote
          num={6}
          text={
            <>
              <span>
                An infected case may have multiple pathogen genotypes present in
                their body, generated as the pathogen replicates. This means
                that sometimes you may observe a few different genotypes which
                vary by 1 -{" "}
                <span className="dataPoint">
                  {clade_description.muts_per_trans_minmax[1]}
                </span>{" "}
                mutations being transmitted during the same superspreader event.
              </span>
            </>
          }
        />
        Differentiating between a superspreader event (where one primary cases
        transmits to many secondary cases) and onward transmission (here,
        defined as tertiary or further downstream cases), can be tricky.
        <sup style={{ fontSize: 10 }}>6</sup>
      </p>
      <p>
        Samples 0 -{" "}
        <span className="dataPoint">
          {clade_description.muts_per_trans_minmax[1]}
        </span>{" "}
        mutations from the reference may represent either primary or secondary
        cases. It's usually reasonable to assume that samples with
        <span className="dataPoint">
          {clade_description.muts_per_trans_minmax[1] + 1}
        </span>
        + mutations represent tertiary or further downstream transmission.{" "}
        <sup style={{ fontSize: 10 }}>7</sup>
        <Sidenote
          num="7"
          text={
            <span>
              <a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#how-many-mutations-are-enough-to-rule-linkage-out">
                Learn more about ruling out direct linkage
              </a>{" "}
              and{" "}
              <a href="https://alliblk.github.io/genepi-book/broad-use-cases-for-genomic-epidemiology.html#assessing-linkage-between-cases">
                more generally assessing linkage patterns between cases.
              </a>
            </span>
          }
        />
      </p>
    </div>
  );
}

export default OnwardTransmission;
