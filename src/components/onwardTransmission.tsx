import { CladeDescription, Node } from "../d";
import { get_dist } from "../utils/treeMethods";
import Sidenote from "./sidenote";

type OnwardTransmissionProps = {
  clade_description: CladeDescription;
};

function OnwardTransmission(props: OnwardTransmissionProps) {
  const { clade_description } = props;
  const all_clade_samples: Node[] = clade_description.selected_samples.concat(
    clade_description.unselected_samples_in_cluster
  );

  const tertiary_cases: string[] = all_clade_samples
    .filter(
      (x) =>
        get_dist([x, clade_description.mrca]) >
        clade_description.muts_per_trans_minmax[1]
    )
    .map((x) => x.name)
    .sort();

  return (
    <div>
      <h2>How much onward transmission have we observed?</h2>
      <p style={{ fontStyle: "italic" }}>
        Differentiating between a superspreader event (where one primary cases
        transmits to multiple secondary cases) and onward transmission (here,
        defined as tertiary or further downstream cases), can be tricky.
      </p>
      <p>
        <Sidenote
          num={5}
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
        An infected case may have multiple pathogen genotypes present in their
        body, generated as the pathogen replicates. This means that sometimes
        you may observe a few different genotypes which vary by 1 -{" "}
        <span className="dataPoint">
          {clade_description.muts_per_trans_minmax[1]}
        </span>{" "}
        mutations being transmitted during the same superspreader event.
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
        <sup style={{ fontSize: 10 }}>5</sup>
      </p>
      <div className="results">
        <p>
          In this clade,{" "}
          <span className="dataPoint">{tertiary_cases.length}</span> sample(s)
          likely represent onward transmission
          {tertiary_cases.length > 1
            ? tertiary_cases.map((c) => <span className="dataPoint">{c}</span>)
            : ""}
          .
        </p>
      </div>
    </div>
  );
}

export default OnwardTransmission;
