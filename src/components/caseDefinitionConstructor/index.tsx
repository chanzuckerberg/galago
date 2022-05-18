import { Node, metadataFieldSummary } from "../../d";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Selectors from "./selectors";

export const caseDefinitionConstructor = () => {
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

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

  return (
    <div>
      <h2>Case definition</h2>
      <label>Choose metadata fields to filter on:</label>
      <br />
      <select
        multiple
        onChange={(e) => {
          let selectedFieldsHTMLObject = e.target.selectedOptions;
          let selectedFields: string[] = [];
          for (let i = 0; i < selectedFieldsHTMLObject.length; i++) {
            selectedFields.push(selectedFieldsHTMLObject[i].value);
          }
          setSelectedFields(selectedFields);
        }}
      >
        {Object.entries(state.metadataCensus).map((entry, index) => {
          if (fieldIsValid(entry[1])) {
            return (
              <option value={entry[0]} key={index}>
                {entry[0]}
              </option>
            );
          }
        })}
      </select>

      {selectedFields && <Selectors selectedFields={selectedFields} />}
    </div>
  );
};

export default caseDefinitionConstructor;
