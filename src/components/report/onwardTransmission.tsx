import { CladeDescription, Node } from "../../d";
import { get_dist } from "../../utils/treeMethods";
import Sidenote from "../formatters/sidenote";
import { FormatDataPoint } from "../formatters/dataPoint";
import { FormatStringArray } from "../formatters/stringArray";
import { useSelector } from "react-redux";

type OnwardTransmissionProps = {
  sidenote_start: number;
};

function OnwardTransmission(props: OnwardTransmissionProps) {
  //@ts-ignore
  const state = useSelector((state) => state.global);

  const { sidenote_start } = props;
  const cladeDescription = state.cladeDescription;
  const all_clade_samples: Node[] = cladeDescription.selected_samples.concat(
    cladeDescription.unselected_samples_in_cluster
  );

  const tertiary_cases: string[] = all_clade_samples
    .filter(
      (x) =>
        get_dist([x, cladeDescription.mrca]) >
        cladeDescription.muts_per_trans_minmax[1]
    )
    .map((x) => x.name);

  return (
    <div className="reportSection">
      <h2>How much onward transmission have we observed?</h2>
      <p style={{ fontStyle: "italic" }}>
        Differentiating between a superspreader event (where one primary case
        transmits to multiple secondary cases) and onward transmission (here,
        defined as tertiary or further downstream cases), can be tricky.
      </p>
      <p>
        <Sidenote
          num={sidenote_start}
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
        you may observe a few different genotypes which vary by
        <FormatDataPoint
          value={`0 - ${cladeDescription.muts_per_trans_minmax[1]}`}
        />
        mutations being transmitted to secondary cases during the same
        superspreader event.
      </p>
      <p>
        It's usually reasonable to assume that samples with
        <FormatDataPoint
          value={cladeDescription.muts_per_trans_minmax[1] + 1}
        />
        + mutations represent tertiary or further downstream transmission.
        <sup style={{ fontSize: 10 }}>{sidenote_start}</sup>
      </p>
      <div className="results">
        <p>
          In this clade,
          <FormatDataPoint value={tertiary_cases.length} /> sample(s) likely
          represent onward transmission:
          {tertiary_cases.length > 1 ? (
            <FormatStringArray values={tertiary_cases} />
          ) : (
            ""
          )}
        </p>
      </div>
    </div>
  );
}

export default OnwardTransmission;
