import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export const SamplesOfInterest = () => {
  const dispatch = useDispatch();
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);

  return (
    <div>
      <p>Samples of Interest</p>
      <TextField
        id="selectedSamples"
        label="Samples of Interest"
        multiline
        rows={3}
        style={{ width: "15em" }}
        defaultValue={
          state.samplesOfInterestNames
            ? state.samplesOfInterestNames.join(", ")
            : "Input sample IDs here, or select them via a case definition filter below."
        }
        onChange={(e) => {
          dispatch({
            type: "sample names string changed",
            data: e.target.value,
          });
        }}
        size="small"
      />
      <br />
      <Button
        variant="contained"
        name="submitSamplesOfInterest"
        onClick={(e) => dispatch({ type: "sample submit button clicked" })}
        size="small"
      >
        Highlight & Subset
      </Button>
    </div>
  );
};

export default SamplesOfInterest;
