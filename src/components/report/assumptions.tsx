import Sidenote from "../formatters/sidenote";
import { CladeDescription } from "../../d";

type AssumptionsProps = {
  clade_description: CladeDescription;
  sidenote_start: number;
};

function Assumptions(props: AssumptionsProps) {
  const { clade_description, sidenote_start } = props;
  return (
    <div style={{ marginTop: 70 }}>
      <h2> What assumptions influence this report?</h2>
      <p style={{ fontStyle: "italic" }}>
        Most of the data and insights described in this report are strictly
        observational (meaning they don't depend on heuristics or "judgement
        calls"). However, there are a few exceptions:
      </p>
      <p>
        <Sidenote
          num={sidenote_start}
          text={`This determines which samples are mostly likely from tertiary cases
      (onward transmission).`}
        />
        <Sidenote
          num={sidenote_start + 1}
          text={`
Higher values mean that we search more broadly for "cousins".`}
        />
      </p>
      <div className="results">
        <ul>
          <li>
            We assume that the number of mutations that occurs with each
            transmission ranges between{" "}
            <span className="dataPoint">
              {clade_description.muts_per_trans_minmax[0]} -{" "}
              {clade_description.muts_per_trans_minmax[1]}
            </span>
            .<sup style={{ fontSize: "10" }}>{sidenote_start}</sup>
          </li>
          <br />
          <li>
            When looking for samples that are outside your clade by closely
            related ("cousins"), we trace back to the most recent grand/parent
            that is separated from the primary case by at least{" "}
            <span className="dataPoint">
              {clade_description.min_muts_to_parent}
            </span>{" "}
            mutation(s).
            <sup style={{ fontSize: "10" }}>{sidenote_start + 1}</sup>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Assumptions;
