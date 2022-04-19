import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export const SamplesOfInterest = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.global);

  return (
    <div>
      <h3>Highlight samples of interest</h3>
      <p>
        Input samples of interest to highlight them in the graph and suggest
        only clusters that contain at least one of your input sample(s).
        <br />
        <span style={{ fontSize: "0.8em", fontStyle: "italic" }}>
          Must match sample names in your tree file
        </span>
        <input
          type="text"
          name="selectedSamples"
          onChange={(e) => {
            dispatch({
              type: "sample names string changed",
              data: e.target.value,
            });
          }}
          style={{ width: "30em" }}
          value={
            state.samplesOfInterestNames
              ? state.samplesOfInterestNames.join(", ")
              : "SampleID1, SampleID2, ..."
          }
        />
        <button
          type="button"
          name="submitInput"
          onClick={(e) => dispatch({ type: "sample submit button clicked" })}
        >
          Highlight and subset
        </button>
      </p>
    </div>
  );
};

export default SamplesOfInterest;
