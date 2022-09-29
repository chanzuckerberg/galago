import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Autocomplete, FormLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CaseDefinitionConstructor from "./caseDefinitionConstructor";
import { get_leaves } from "src/utils/treeMethods";
import { Node } from "src/d";
import { stringToNames } from "src/utils/samplesOfInterestSelection";

export const SamplesOfInterest = () => {
  const dispatch = useDispatch();
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);
  // raw string input to autocomplete's textfield child component
  const [inputValue, setInputValue] = useState("");
  const [caseDefOpen, setCaseDefOpen] = useState<boolean>(false);

  // prep data
  const allSamples = get_leaves(state.tree);
  let namesToNodes: { [key: string]: Node } = {};
  allSamples.forEach((n: Node) => (namesToNodes[n.name.toLowerCase()] = n));

  const handleValueChange = (newValues: Array<string | Node>) => {
    /* fires whenever 
    (1) the user selects from the autocomplete list
    (2) the user types and hits 'enter'
    (3) state.samplesOfInterest changes for any other reason

    goal is to update state.samplesOfInterest (and state.samplesOfInterestNames) 
    with any valid node names that come in as text, while retaining any invalid strings 
    (i.e., not a real node name) as raw inputValue text in the Textfield component in 
    case the user wants to fix a typo, etc
    */

    let newSamplesOfInterest: Node[] = [];
    let allCruft: string[] = [];

    newValues.forEach((value: string | Node) => {
      if (typeof value === "string") {
        // splits on whitespace or comma, separates out valid node names
        const { validInputNames, cruft } = stringToNames(value, namesToNodes);
        newSamplesOfInterest = newSamplesOfInterest.concat(
          validInputNames.map((name: string) => namesToNodes[name])
        );
        allCruft = allCruft.concat(cruft);
      } else {
        newSamplesOfInterest.push(value);
      }
    });

    dispatch({
      type: "samples of interest changed",
      data: newSamplesOfInterest,
    });
    setInputValue(allCruft.join(" "));
  };

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
              dispatch({ type: "samples of interest changed", data: [] });
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
        filterSelectedOptions
        limitTags={50}
        // options (and value) are Nodes
        options={allSamples}
        value={state.samplesOfInterest}
        getOptionLabel={(option: Node | string) => {
          if (typeof option === "string") {
            return option;
          } else {
            return option.name;
          }
        }}
        onChange={(event, newValues) => {
          handleValueChange(newValues);
        }}
        // handle inputValue separately from value so that we can do nice things like split on delimiters to accommodate copy/paste, retain invalid string fragments, etc.
        inputValue={inputValue}
        onInputChange={(event, newInputString) => {
          setInputValue(newInputString);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Sample1, Sample2, ..." />
        )}
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
