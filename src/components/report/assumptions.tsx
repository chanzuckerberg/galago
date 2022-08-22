import Sidenote from "../formatters/sidenote";
import { CladeDescription } from "../../d";
import { useSelector } from "react-redux";

type AssumptionsProps = {
  sidenote_start: number;
};

function Assumptions(props: AssumptionsProps) {
  const { sidenote_start } = props;
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const cladeDescription = state.cladeDescription;
  return (
    <div className="reportSection">
      <h2> What assumptions influence this report?</h2>
      <p style={{ fontStyle: "italic" }}>
        Most of the data and insights described in this report are strictly
        observational (meaning they don't depend on heuristics or "judgement
        calls"). However, there are a few exceptions:
      </p>
      <span className="results">
        <ul>
          <li>
            We assume that the{" "}
            <Sidenote
              target={`number of mutations`}
              contents={`This determines which samples are mostly likely from tertiary cases
      (onward transmission).`}
            />{" "}
            that occurs with each transmission ranges between{" "}
            <span className="dataPoint">
              0 - {cladeDescription.mutsPerTransmissionMax}
            </span>
          </li>
          <br />
          <li>
            When looking for samples that are outside your clade by closely
            related ("cousins"), we trace back to the most recent grand/parent
            that is{" "}
            <Sidenote
              target={"separated from the primary case by"}
              contents={`
Higher values mean that we search more broadly for "cousins".`}
            />{" "}
            at least{" "}
            <span className="dataPoint">
              {cladeDescription.min_muts_to_parent}
            </span>{" "}
            mutation(s).
          </li>
        </ul>
      </span>
    </div>
  );
}

export default Assumptions;
