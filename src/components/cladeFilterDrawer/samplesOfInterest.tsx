import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { tooltipProps } from "../formatters/sidenote";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CaseDefinitionConstructor from "./caseDefinitionConstructor";
import { get_leaves, traverse_preorder } from "src/utils/treeMethods";
import { Node } from "src/d";

export const SamplesOfInterest = () => {
  const dispatch = useDispatch();
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);
  const allSamples = get_leaves(state.tree);
  let namesToSamples: { [key: string]: Node } = {};
  allSamples.forEach((n: Node) => (namesToSamples[n.name] = n));
  const allSampleNames = Object.keys(allSamples);

  const stringToNames = (inputString: string) => {
    const inputNames = inputString
      .split(/[\s\t,]+/)
      .map((splitString: string) => splitString.replace(/[\s\t,]+/, "").trim());

    const validInputNames = inputNames.filter((name: string) =>
      allSampleNames.includes(name)
    );

    return validInputNames;
  };

  const [inputValue, setInputValue] = useState("");
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
      <Autocomplete
        id="selectedSamples"
        multiple
        freeSolo
        options={allSamples}
        //@ts-ignore
        getOptionLabel={(option: Node) => option.name}
        renderInput={(params) => (
          <TextField {...params} label="Sample1, Sample2, ..." />
        )}
        inputValue={inputValue}
        value={state.samplesOfInterest}
        onInputChange={(event, newInputString) => {
          console.log("NEW INPUT VALUE", newInputString);
          setInputValue(newInputString);
          const validInputNames = stringToNames(newInputString);
          dispatch({
            type: "samples of interest names changed",
            data: validInputNames,
          });
        }}
        onChange={(event, newValues) => {
          let newSamplesOfInterest: Node[] = [];

          newValues.forEach((value: string | Node) => {
            if (typeof value === "string") {
              const names = stringToNames(value);
              newSamplesOfInterest.concat(
                names.map((name: string) => namesToSamples[name])
              );
            } else {
              newSamplesOfInterest.push(value);
            }
          });

          const newSamplesOfInterestNames = newSamplesOfInterest.map(
            (node: Node) => node.name
          );

          dispatch({
            type: "samples of interest names changed",
            data: newSamplesOfInterestNames,
          });
          dispatch({
            type: "samples of interest changed",
            data: newSamplesOfInterest,
          });
          setInputValue(state.samplesOfInterestNames);
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
      {caseDefOpen && (
        <CaseDefinitionConstructor setCaseDefOpen={setCaseDefOpen} />
      )}
    </div>
  );
};

export default SamplesOfInterest;
