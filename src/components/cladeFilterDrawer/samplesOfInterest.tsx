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
  let namesToNodes: { [key: string]: Node } = {};
  allSamples.forEach((n: Node) => (namesToNodes[n.name.toLowerCase()] = n));
  const allSampleNames = Object.keys(namesToNodes);

  const stringToNames = (inputString: string) => {
    const splitStrings = inputString
      .split(/[\s\t,]+/)
      .map((splitString: string) =>
        splitString
          .replace(/[\s\t,]+/, "")
          .trim()
          .toLowerCase()
      );

    // console.log("split strings", splitStrings);
    // console.log("allsamplenames", allSampleNames.sort());

    const validInputNames = splitStrings.filter((name: string) =>
      allSampleNames.includes(name)
    );

    const cruft = splitStrings.filter(
      (str: string) => !allSampleNames.includes(str)
    );

    return { validInputNames, cruft };
  };

  const [inputValue, setInputValue] = useState("");
  // const handleInputValueChange = (newInputString: string) => {
  //   const timeoutId = setTimeout(() => {
  //     const { validInputNames, cruft } = stringToNames(newInputString);
  //     if (validInputNames) {
  //       dispatch({
  //         type: "samples of interest changed",
  //         data: validInputNames.map((name: string) => namesToNodes[name]),
  //       });
  //       // console.log("valid names parsed", validInputNames);
  //     }
  //     if (cruft) {
  //       setInputValue(cruft.join(", "));
  //     }
  //   }, 100);
  //   return () => clearTimeout(timeoutId);
  // };

  const handleValueChange = (newValues: Array<string | Node>) => {
    let newSamplesOfInterest: Node[] = [];
    let allCruft: string[] = [];

    newValues.forEach((value: string | Node) => {
      if (typeof value === "string") {
        const { validInputNames, cruft } = stringToNames(value);
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
        filterSelectedOptions
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
          console.log("NEW VALUE", newValues);
          handleValueChange(newValues);
        }}
        // input value is a string that we then want to parse
        inputValue={inputValue}
        onInputChange={(event, newInputString) => {
          console.log("NEW INPUT VALUE", newInputString);
          setInputValue(newInputString);

          // handleInputValueChange(newInputString);
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
