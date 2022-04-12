import { useDispatch } from "react-redux";
import { samplesOfInterestAC } from "../../actions/samplesOfInterestAC";
import { useSelector } from "react-redux";

export const SamplesOfInterest = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  return (
    <p>
      Optionally, input samples of interest to highlight them in the graph and
      eliminate inferred primary cases (and corresponding clusters) that are
      unrelated.
      <br />
      <input
        type="text"
        name="selectedSamples"
        onChange={(e) => {
          dispatch({ type: "input string changed", data: e.target.value });
        }}
        style={{ width: "35em" }}
        value={
          state.samplesOfInterestNames
            ? state.samplesOfInterestNames.join(", ")
            : "SampleID1, SampleID2, ..."
        }
      />
      <button
        type="button"
        name="submitInput"
        onClick={(e) => dispatch(samplesOfInterestAC)}
      >
        Highlight and subset
      </button>
    </p>
  );
};

export default SamplesOfInterest;
