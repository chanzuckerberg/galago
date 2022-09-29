import { useSelector, useDispatch } from "react-redux";
import { caseDefFilter } from "../../../d";
import Slider from "@mui/material/Slider";
import { FormControl, FormLabel } from "@mui/material";

type ContinuousDataSliderProps = {
  field: string;
};

export const ContinuousDataSlider = (props: ContinuousDataSliderProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const { field } = props;

  const metadataCensus = state.metadataCensus;

  let range = [metadataCensus[field]["min"], metadataCensus[field]["max"]];

  return (
    <FormControl
      margin="dense"
      fullWidth
      style={{ position: "relative", margin: "auto" }}
    >
      <FormLabel>{field}</FormLabel>
      <Slider
        size="small"
        // style={{ width: "13em" }}
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
    </FormControl>
  );
};

export default ContinuousDataSlider;
