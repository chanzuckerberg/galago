import { useSelector, useDispatch } from "react-redux";
import { caseDefFilter } from "../../../d";
import Slider from "@mui/material/Slider";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import ContingencyTable from "../../viz/contingencyTable";

type SelectorsProps = {
  selectedFields: Set<string>;
};

export const Selectors = (props: SelectorsProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const { selectedFields } = props;
  const selectedFieldsArr = Array.from(selectedFields);
  const metadataCensus = state.metadataCensus;

  const continuousFields = selectedFieldsArr.filter(
    (field) => metadataCensus[field].dataType === "continuous"
  );
  const categoricalFields = selectedFieldsArr.filter(
    (field) => metadataCensus[field].dataType === "categorical"
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        {continuousFields.map((field: string) => {
          let range = [
            metadataCensus[field]["min"],
            metadataCensus[field]["max"],
          ];
          return (
            <div
              style={{
                paddingTop: "10px",
                paddingLeft: "15px",
                paddingBottom: "0px",
              }}
            >
              <label>{field}</label>
              <br />
              <Slider
                size="small"
                style={{ width: "13em" }}
                defaultValue={range}
                //   value={[1, 4]}
                onChange={(e) => {
                  const newFilter: caseDefFilter = {
                    field: field,
                    dataType: "continuous",
                    //@ts-ignore
                    min: e.target.value[0],
                    //@ts-ignore
                    max: e.target.value[1],
                  };
                  dispatch({
                    type: "case definition filters updated",
                    data: newFilter,
                  });
                }}
                valueLabelDisplay="auto"
                step={1}
                min={range[0]}
                max={range[1]}
              />
            </div>
          );
        })}
      </div>
      <div>
        {categoricalFields.map((field) => {
          const allValues = metadataCensus[field]["uniqueValues"];
          let options: any = [];
          allValues.forEach((v: string | boolean | number, i: number) => {
            options.push({ label: v.toString(), id: i });
          });

          return (
            <>
              <Autocomplete
                multiple
                style={{ width: "15em", marginTop: 30 }}
                id="tags-outlined"
                options={options}
                getOptionLabel={(option: any) => option.label}
                limitTags={5}
                disableCloseOnSelect
                size="small"
                // BUG: set is a temp workaround for the fact that filterSelectedOptions doesn't work such that the same variable can be selected more than once
                filterSelectedOptions
                onChange={(event: any, newValue: any) => {
                  const acceptedValues = newValue.map((nv: any) => nv.label);
                  const newFilter: caseDefFilter = {
                    field: field,
                    dataType: "categorical",
                    //@ts-ignore
                    acceptedValues: [...new Set(acceptedValues)],
                  };
                  dispatch({
                    type: "case definition filters updated",
                    data: newFilter,
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label={field} />
                )}
              />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Selectors;
