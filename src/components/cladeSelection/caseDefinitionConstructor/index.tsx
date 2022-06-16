import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Selectors from "./selectors";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

export const CaseDefinitionConstructor = () => {
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());

  const fieldIsValid = (fieldSummary: any) => {
    if (fieldSummary["dataType"] == "categorical") {
      return (
        fieldSummary["uniqueValues"].length <= 100 &&
        fieldSummary["uniqueValues"].length >= 2
      );
    } else {
      return (
        !isNaN(fieldSummary["min"]) &&
        fieldSummary["min"] !== fieldSummary["max"]
      );
    }
  };

  const validFields: Array<any> = [];
  Object.entries(state.metadataCensus).forEach((entry, i) => {
    if (fieldIsValid(entry[1])) {
      validFields.push({ label: entry[0], id: i });
    }
  });

  return (
    <div style={{ marginTop: 30, marginBottom: 50 }}>
      <h3>Case definition</h3>
      <p style={{ fontStyle: "italic", fontSize: 14 }}>
        Optionally, add samples of interest based on a case definition.
      </p>
      <Autocomplete
        multiple
        id="tags-outlined"
        style={{ paddingTop: 15, width: 250 }}
        options={validFields}
        getOptionLabel={(option: any) => option.label}
        limitTags={5}
        disableCloseOnSelect
        size="small"
        // BUG: set is a temp workaround for the fact that filterSelectedOptions doesn't work such that the same variable can be selected more than once
        filterSelectedOptions
        onChange={(event: any, newValue: any) => {
          let newFields = new Set();
          newValue.forEach((nv: { label: string; id: number }) =>
            newFields.add(nv["label"])
          );
          //@ts-ignore - all the labels are strings
          setSelectedFields(newFields); //newValue?.map((nv: any) => nv["label"]));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select metadata fields"
            // placeholder="Favorites"
          />
        )}
      />
      {selectedFields && <Selectors selectedFields={selectedFields} />}
      <Button
        disableElevation
        disableRipple
        style={{ marginTop: 15 }}
        variant="contained"
        name="submitCaseDef"
        onClick={(e) => {
          dispatch({
            type: "case definition submitted",
          });
        }}
        size="small"
        disabled={Object.keys(state.caseDefFilters).length === 0}
      >
        Add matches to Samples of Interest
      </Button>
    </div>
  );
};

export default CaseDefinitionConstructor;
