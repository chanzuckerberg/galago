import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Button, FormLabel } from "@mui/material";
import Theme from "../../../theme";
import { Node } from "../../../d";
import ContinuousDataSlider from "./continuousDataSlider";
import CategoricalDataSelector from "./categoricalDataSelector";
import {
  fieldIsValid,
  filterSamples,
} from "../../../utils/caseDefinitionFilters";
import { get_leaves } from "../../../utils/treeMethods";

type CaseDefinitionConstructorProps = {
  setCaseDefOpen: Function;
};

export const CaseDefinitionConstructor = (
  props: CaseDefinitionConstructorProps
) => {
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const { setCaseDefOpen } = props;

  const [newSamplesMatchingCaseDef, setNewSamplesMatchingCaseDef] = useState<
    Node[]
  >([]);

  const allSamples = get_leaves(state.tree);
  useEffect(() => {
    if (state.caseDefFilters) {
      setNewSamplesMatchingCaseDef(
        filterSamples(
          allSamples,
          state.caseDefFilters,
          state.samplesOfInterestNames
        )
      );
    } else {
      setNewSamplesMatchingCaseDef([]);
    }
  }, [state.caseDefFilters, state.samplesOfInterestNames]);

  const validFields: Array<any> = [];
  Object.entries(state.metadataCensus).forEach((entry, i) => {
    if (fieldIsValid(entry[1])) {
      validFields.push({ label: entry[0], id: i });
    }
  });

  return (
    <div // TODO: this a column flex div with the two buttons together in a div/row at the bottom
      style={{
        //@ts-ignore
        backgroundColor: Theme.palette.secondary.lighter,
        padding: 10,
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <div>
        <h4 style={{ margin: 0 }}>Add samples by case definition:</h4>
        <FormLabel>
          Samples matching selected metadata will be added to the list of Sample
          Names.
        </FormLabel>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ position: "relative", left: 0, width: "50%" }}>
          <Autocomplete
            multiple
            id="tags-outlined"
            style={{ paddingTop: 15, width: 250 }}
            options={validFields}
            getOptionLabel={(option: any) => option.label}
            limitTags={5}
            disableCloseOnSelect
            size="small"
            filterSelectedOptions
            onChange={(event: any, newValue: any) => {
              setSelectedFields(newValue.map((nv: any) => nv.label));
            }}
            isOptionEqualToValue={(opt, value) => {
              return opt.label === value.label;
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select metadata" />
            )}
          />
        </div>

        <div
          style={{
            position: "relative",
            left: 0,
            top: 5,
            width: "50%",
          }}
        >
          {selectedFields &&
            selectedFields.map((field: string) =>
              state.metadataCensus[field]["dataType"] === "continuous" ? (
                <ContinuousDataSlider field={field} />
              ) : (
                <CategoricalDataSelector field={field} />
              )
            )}
        </div>
      </div>

      <div>
        <Button
          disableElevation
          disableRipple
          style={{ marginTop: 30, marginRight: 30 }}
          variant="contained"
          name="submitCaseDef"
          onClick={(e) => {
            dispatch({
              type: "case definition submitted",
              data: newSamplesMatchingCaseDef,
            });
            setCaseDefOpen(false);
          }}
          size="small"
          disabled={newSamplesMatchingCaseDef.length < 1}
        >
          {`Add ${newSamplesMatchingCaseDef.length} samples`}
        </Button>
        <Button
          variant="text"
          style={{ marginTop: 30 }}
          onClick={() => {
            setSelectedFields([]);
            dispatch({ type: "case definition filters cleared" });
            setCaseDefOpen(false);
          }}
        >
          CANCEL
        </Button>
      </div>
    </div>
  );
};

export default CaseDefinitionConstructor;
