import { useSelector, useDispatch } from "react-redux";
import { caseDefFilter } from "../../../d";
import Slider from "@mui/material/Slider";
import ContingencyTable from "../../viz/contingencyTable";

type SelectorsProps = {
  selectedFields: string[];
};

export const Selectors = (props: SelectorsProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const { selectedFields } = props;
  const metadataCensus = state.metadataCensus;

  const continuousFields = selectedFields.filter(
    (field) => metadataCensus[field].dataType === "continuous"
  );
  const categoricalFields = selectedFields.filter(
    (field) => metadataCensus[field].dataType === "categorical"
  );

  return (
    <>
      {continuousFields.map((field: string) => {
        let range = [
          metadataCensus[field]["min"],
          metadataCensus[field]["max"],
        ];
        return (
          <p style={{ width: "15em" }}>
            <label>{field}</label>
            <Slider
              size="small"
              defaultValue={range}
              //   value={[1, 4]}
              onChange={(e) => {
                const newFilter: caseDefFilter = {
                  field: field,
                  dataType: "continuous",
                  min: e.target.value[0],
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
          </p>
        );
      })}

      {categoricalFields.map((field) => {
        return (
          <p>
            <label>{field}</label>
            <br />
            <select
              multiple
              onChange={(e) => {
                let selectedValuesHTMLObject = e.target.selectedOptions;
                let acceptedValues: string[] = [];
                for (let i = 0; i < selectedValuesHTMLObject.length; i++) {
                  acceptedValues.push(selectedValuesHTMLObject[i].value);
                }
                const newFilter: caseDefFilter = {
                  field: field,
                  dataType: "categorical",
                  acceptedValues: acceptedValues,
                };
                dispatch({
                  type: "case definition filters updated",
                  data: newFilter,
                });
              }}
            >
              {metadataCensus[field]["uniqueValues"].map((val: any) => {
                return <option value={val.toString()}>{val.toString()}</option>;
              })}
            </select>
          </p>
        );
      })}
      <button
        onClick={(e) => {
          dispatch({
            type: "case definition submitted",
          });
        }}
      >
        Submit
      </button>
      {/* <ContingencyTable /> */}
    </>
  );
};

export default Selectors;
