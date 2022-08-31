import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { tooltipProps } from "../formatters/sidenote";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { FormControl, FormControlLabel, FormLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CaseDefinitionConstructor from "./caseDefinitionConstructor";

export const SamplesOfInterest = () => {
  const dispatch = useDispatch();
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);

  const [caseDefOpen, setCaseDefOpen] = useState<boolean>(false);

  return (
    <div>
      <h2>Filter to clades which contain your samples of interest </h2>
      <p>
        <FormLabel>
          Add samples of interest to see them highlighted in the graph and
          filter to clades which contain at least one of these samples.
        </FormLabel>
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h4 style={{ marginBottom: 0, marginTop: 0 }}>Sample Names: </h4>
          <FormLabel>
            {state.samplesOfInterest.length} Samples of interest
          </FormLabel>
        </div>
        <div style={{ position: "relative", top: 20 }}>
          <Button
            variant="text"
            color="primary"
            disabled={state.samplesOfInterestNames === ""}
            onClick={() => {
              dispatch({ type: "sample names string changed", data: "" });
              dispatch({ type: "sample submit button clicked" });
            }}
          >
            CLEAR ALL
          </Button>
        </div>
      </div>
      <TextField
        id="selectedSamples"
        placeholder="SampleName1, SampleName2, ..."
        multiline
        rows={4}
        fullWidth={true}
        value={state.samplesOfInterestNames.join(", ")}
        onChange={(e) => {
          dispatch({
            type: "sample names string changed",
            data: e.target.value,
          });
        }}
        size="small"
        sx={{
          fontSize: 14,
          paddingTop: 1,
        }}
      />
      <br />
      <br />

      {!caseDefOpen && (
        <Button
          variant="text"
          style={{
            padding: "10px 2px 10px 2px",
            position: "relative",
            left: -3,
          }}
          onClick={() => {
            setCaseDefOpen(true);
          }}
        >
          <AddIcon />
          ADD BY CASE DEFINITION
        </Button>
      )}
      {caseDefOpen && <CaseDefinitionConstructor />}
    </div>
  );
};

export default SamplesOfInterest;
