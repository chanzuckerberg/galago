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
      {/* <p>Samples of Interest</p> */}
      <h2>Samples of interest</h2>
      <p style={{ fontStyle: "italic", fontSize: 14 }}>
        Specify samples of interest -- either by name or using a case definition
        (below) -- to see them highlighted in the graph and filter to clades
        that contain at least one of these samples.
      </p>
      <TextField
        id="selectedSamples"
        // label="Samples of Interest"
        multiline
        rows={4}
        fullWidth={true}
        // style={{ width: "15em" }}
        value={
          state.samplesOfInterestNames
            ? state.samplesOfInterestNames.join(", ")
            : "Input sample IDs here, or select them via a case definition filter."
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
        disableElevation
        disableRipple
        variant="contained"
        name="submitSamplesOfInterest"
        onClick={(e) => dispatch({ type: "sample submit button clicked" })}
        size="small"
        style={{ marginTop: 15 }}
      >
        Highlight & Subset
      </Button>
    </div>
  );
};

export default SamplesOfInterest;
