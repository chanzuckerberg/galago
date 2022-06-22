import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  get_division_input_options,
  get_location_input_options,
} from "../../utils/geoInputOptions";
import { ingestNextstrain } from "../../utils/nextstrainAdapter";
import { Node } from "../../d";
//@ts-ignore
import { parse } from "papaparse";
import { ingestCSVMetadata } from "../../utils/metadataUtils";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
} from "@mui/material";

export const Upload = () => {
  // @ts-ignore -- one day I will learn how to `type` all my state variables, but that day is not today
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      const { tidyMetadata, metadataCensus } = ingestCSVMetadata(results.data);
      console.log(metadataCensus);
      dispatch({
        type: "metadata uploaded and parsed",
        data: { metadataCensus: metadataCensus, tidyMetadata: tidyMetadata },
      });
      setMetadataKeyOptions(
        Object.keys(metadataCensus).filter(
          (field: string) => metadataCensus[field]["dataType"] === "categorical"
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

  useEffect(() => {
    console.log("location or division [options] changed\n", {
      division: state.division,
      divisionOptions: divisionOptions,
      location: state.location,
      locationOptions: locationOptions,
    });
  }, [divisionOptions, locationOptions, state.location, state.division]);

  return (
    <div className="reportSection">
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
        <br />
        <input
          type="file"
          name="file"
          onChange={(event: any) => {
            handleTreeFileUpload(event.target.files[0]);
          }}
        />
      </p>
      <b>Next, select your location.</b>
      <br />
      <p>
        <FormControl>
          <FormLabel>Select state/province</FormLabel>
          <Select
            id="divisionSelect"
            //@ts-ignore
            onChange={(e) => handleDivisionSelection(e.target.value)}
            style={{ width: 200 }}
            size="small"
            disabled={!divisionOptions}
          >
            {divisionOptions &&
              divisionOptions.map((division: string) => (
                <MenuItem value={division}>{division}</MenuItem>
              ))}
          </Select>
        </FormControl>
      </p>
      <p>
        <FormControl>
          <FormLabel>Select county/location</FormLabel>
          <Select
            id="locationSelect"
            //@ts-ignore
            onChange={(event) => {
              dispatch({
                type: "location set",
                data: event.target.value,
              });
            }}
            style={{ width: 200 }}
            size="small"
            disabled={!locationOptions}
          >
            {locationOptions &&
              locationOptions.map((loc: string) => (
                <MenuItem value={loc}>{loc}</MenuItem>
              ))}
          </Select>
        </FormControl>
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
      </p>
      <p>
        <FormControl>
          <FormLabel style={{ width: "30em" }}>
            Select field/column to match sample names
          </FormLabel>
          <Select
            id="metadataKeySelect"
            //@ts-ignore
            onChange={(e) =>
              dispatch({
                type: "metadata match field selected",
                data: e.target.value,
              })
            }
            style={{ width: 200 }}
            size="small"
            disabled={!metadataKeyOptions}
          >
            {metadataKeyOptions &&
              metadataKeyOptions.map((key: string) => (
                <MenuItem value={key}>{key}</MenuItem>
              ))}
          </Select>
        </FormControl>
      </p>
      <p>
        <Button
          variant="contained"
          disableElevation
          disableRipple
          onClick={(e) => {
            dispatch({ type: "upload submit button clicked" });
            navigate("/galago/app");
          }}
          disabled={!state.division || !state.location || !state.tree}
        >
          Submit
        </Button>
      </p>
    </div>
  );
};

export default Upload;
