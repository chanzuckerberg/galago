import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  get_division_input_options,
  get_location_input_options,
} from "../../utils/geoInputOptions";
import { ingestNextstrain } from "../../utils/nextstrainAdapter";
import { Node } from "../../d";
import { parse } from "papaparse";

export const Upload = () => {
  // @ts-ignore -- one day I will learn how to `type` all my state variables, but that day is not today
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const [divisionOptions, setDivisionOptions] = useState<null | Array<string>>(
    null
  );
  const [locationOptions, setLocationOptions] = useState<null | Array<string>>(
    null
  );

  const handleTreeFileUpload = (file: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file, "application/JSON");
    fileReader.onload = (event) => {
      if (event?.target?.result && typeof event.target.result === "string") {
        const newTree: Node = ingestNextstrain(JSON.parse(event.target.result));
        dispatch({ type: "tree file uploaded", data: newTree });
        setDivisionOptions(get_division_input_options(newTree, state.country));
      }
    };
  };

  const handleDivisionSelection = (division: string) => {
    dispatch({ type: "division set", data: division });
    setLocationOptions(get_location_input_options(state.tree, division));
    console.log(state.tree, state.country, locationOptions);
  };

  return (
    <div>
      <h2>Analyze your data</h2>
      <p>
        <i>
          Galago runs entirely in the browser. This means that your data never
          leaves your computer and is never accessible to anyone else.
        </i>
      </p>
      <p>
        <b>First, please upload a tree file.</b>
        <br />
        <i>This must be in Nextstrain's JSON file format.</i>
        <input
          type="file"
          name="file"
          onChange={(event: any) => {
            handleTreeFileUpload(event.target.files[0]);
          }}
        />
      </p>
      <b>Next, please choose your location.</b>
      <br />
      <p>
        State:{" "}
        <select
          id="division-select"
          name="State"
          onChange={(e) => handleDivisionSelection(e.target.value)}
          disabled={!divisionOptions}
          style={{ width: "15em" }}
          defaultValue={""}
        >
          {divisionOptions &&
            divisionOptions.map((division: string) => (
              <option value={division}>{division}</option>
            ))}
        </select>
      </p>
      <p>
        County:{" "}
        <select
          id="location-select"
          name="County"
          onChange={(event) => {
            dispatch({
              type: "location set",
              data: event.target.value,
            });
          }}
          disabled={!locationOptions}
          style={{ width: "15em" }}
        >
          {locationOptions &&
            locationOptions.map((county: string) => (
              <option value={county}>{county}</option>
            ))}
        </select>
      </p>
    </div>
  );
};

export default Upload;
