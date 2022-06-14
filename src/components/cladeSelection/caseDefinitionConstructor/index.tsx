import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Selectors from "./selectors";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export const caseDefinitionConstructor = () => {
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
    <div style={{ width: "15em", padding: "10px 10px 0px" }}>
      <h3>Case definition</h3>
      Optionally, add samples of interest based on a case definition.
      <Autocomplete
        multiple
        style={{ width: "15em", paddingTop: "10px" }}
        id="tags-outlined"
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
    </div>
  );
};

export default caseDefinitionConstructor;
