import Sidenote from "./sidenote";
import { CladeDescription } from "../d";

type AssumptionsProps = {
  clade_description: CladeDescription;
};

function Assumptions(props: AssumptionsProps) {
  const { clade_description } = props;
  return (
    <div>
      <h2> What assumptions influence this report?</h2>
      <p style={{ fontStyle: "italic" }}>
        Most of the data and insights described in this report are strictly
        observational (meaning they don't depend on heuristics or "judgement
        calls"). However, there are a few exceptions:
      </p>
      <div className="results">
        <ul>
          <li>
            <Sidenote
              num={6}
              text={`This determines which samples are mostly likely from tertiary cases
      (onward transmission).`}
            />
            We assume that the number of mutations that occurs with each
            transmission ranges between{" "}
            <span className="dataPoint">
              {clade_description.muts_per_trans_minmax[0]} -{" "}
              {clade_description.muts_per_trans_minmax[1]}
            </span>
            .<sup style={{ fontSize: "10" }}>6</sup>
          </li>
          <br />
          <li>
            <Sidenote
              num={7}
              text={`
Higher values mean that we search more broadly for "cousins".`}
            />
            When looking for samples that are outside your clade by closely
            related ("cousins"), we trace back to the most recent grand/parent
            that is separated from the primary case by at least{" "}
            <span className="dataPoint">
              {clade_description.min_muts_to_parent}
            </span>{" "}
            mutation(s).<sup style={{ fontSize: "10" }}>7</sup>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Assumptions;
