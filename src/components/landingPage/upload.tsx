import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  get_division_input_options,
  get_location_input_options,
} from "../../utils/geoInputOptions";
import { ingestNextstrain } from "../../utils/nextstrainAdapter";
import { Node } from "../../d";
import { parse } from "papaparse";
import { ingestMetadata } from "../../utils/metadataUtils";

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
  const [metadataKeyOptions, setMetadataKeyOptions] = useState<null | string[]>(
    null
  );

  const handleMetadataUpload = (file: any) => {
    const runOnUpload = (results: any, file: any) => {
      const { tidyMetadata, metadataCensus } = ingestMetadata(results.data);
      dispatch({
        type: "metadata uploaded and parsed",
        data: { metadataCensus: metadataCensus, tidyMetadata: tidyMetadata },
      });
      setMetadataKeyOptions(
        Object.keys(
          metadataCensus.filter(
            (field: string) =>
              metadataCensus[field]["dataType"] === "categorical"
          )
        )
      );
    };

    const csvConfig = {
      header: true,
      dynamicTyping: true, // convert numbers and dates
      preview: 10000, // limit of n rows to parse
      worker: false, // keeps page responsive, might slow down process overall - disabled for now
      comments: "#",
      complete: runOnUpload,
      error: undefined, // callback if encounters error
      skipEmptyLines: "greedy", // skip lines that are empty or evaluate to only whitespace
      transform: undefined, //A function to apply on each value. The function receives the value as its first argument and the column number or header name when enabled as its second argument. The return value of the function will replace the value it received. The transform function is applied before dynamicTyping.
    };

    parse(file, csvConfig);
  };

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
      <p>
        <b>Optionally, upload sample metadata (e.g., a line list)</b>
        <br />
        <i>
          Helps you identify meaningful clusters and integrate genomic and
          epidemiological insights.
        </i>
        <br />
        <input
          type="file"
          name="file"
          onChange={(event: any) => {
            handleMetadataUpload(event.target.files[0]);
          }}
        />
        <br />
        Field to match metadata to sample names:
        <br />
        <select
          id="metadata-key-select"
          name="metadataKey"
          onChange={(e) =>
            dispatch({ type: "metadata field selected", data: e.target.value })
          }
          disabled={!metadataKeyOptions}
          style={{ width: "15em" }}
          defaultValue={""}
        >
          {metadataKeyOptions &&
            metadataKeyOptions.map((field: string) => (
              <option value={field}>{field}</option>
            ))}
        </select>
      </p>
      <p>
        <button onClick={(e) => dispatch({ type: "submit button clicked" })}>
          Submit
        </button>
      </p>
    </div>
  );
};

export default Upload;
