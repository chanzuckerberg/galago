import { useSelector, useDispatch } from "react-redux";
import { caseDefFilter } from "../../../d";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type CategoricalDataSelectorProps = {
  field: string;
};

export const CategoricalDataSelector = (
  props: CategoricalDataSelectorProps
) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const { field } = props;
  const metadataCensus = state.metadataCensus;

  const allValues = metadataCensus[field]["uniqueValues"];
  let options: any = [];
  allValues.forEach((v: string | boolean | number, i: number) => {
    options.push({ label: v.toString(), id: i });
  });
  return (
    <Autocomplete
      multiple
      style={{marginTop: 10 }}
      id="tags-outlined"
      options={options}
      getOptionLabel={(option: any) => option.label}
      limitTags={5}
      disableCloseOnSelect
      size="small"
      fullWidth={true}
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
      renderInput={(params) => <TextField {...params} label={field} />}
    />
  );
};

export default CategoricalDataSelector;
