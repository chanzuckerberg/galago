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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import PathogenSelection from "./pathogenSelection";

export const UploadModal = () => {
  // @ts-ignore -- one day I will learn how to `type` all my state variables, but that day is not today
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [locationOptions, setLocationOptions] = useState<null | Array<string>>(
    null
  );
  const [metadataKeyOptions, setMetadataKeyOptions] = useState<null | string[]>(
    null
  );

  const handleDivisionSelection = (division: string) => {
    dispatch({ type: "division set", data: division });
    setLocationOptions(get_location_input_options(state.tree, division));
  };

  const handleMetadataUpload = (file: any) => {
    const runOnUpload = (results: any, file: any) => {
      const { tidyMetadata, metadataCensus } = ingestCSVMetadata(results.data);
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

  return (
    <>
      <DialogTitle>Analyze your data in Galago</DialogTitle>
      <DialogContent>
        <h3>Select pathogen (required)</h3>

        <p>
          <PathogenSelection />
        </p>
        <h3>Select your location of interest (required)</h3>
        <p>
          <FormControl>
            <FormLabel>State / Province</FormLabel>
            <Select
              variant="standard"
              id="divisionSelect"
              //@ts-ignore
              onChange={(e) => handleDivisionSelection(e.target.value)}
              style={{ width: 200 }}
              size="small"
              disabled={!state.divisionOptions}
              value={state.division}
            >
              {state.divisionOptions &&
                state.divisionOptions.map((division: string) => (
                  <MenuItem value={division}>{division}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </p>
        {state.division && locationOptions && (
          <p>
            <FormControl>
              <FormLabel>County / location</FormLabel>
              <Select
                id="locationSelect"
                //@ts-ignore
                onChange={(event) => {
                  dispatch({
                    type: "location set",
                    data: event.target.value,
                  });
                }}
                variant="standard"
                value={state.location}
                style={{ width: 200 }}
                size="small"
              >
                {locationOptions.map((loc: string) => (
                  <MenuItem value={loc}>{loc}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </p>
        )}
        <h3>Upload sample metadata, e.g. a line list (optional)</h3>
        <p>
          If provided, epi metadata helps you identify more meaningful clusters.
        </p>
        <p>
          <FormControl>
            <Button
              component="label"
              disableElevation
              disableRipple
              onChange={(event: any) => {
                handleMetadataUpload(event.target.files[0]);
              }}
              style={{ width: 225 }}
            >
              Select metadata CSV <input hidden type="file" />
            </Button>
          </FormControl>
        </p>
        <p>
          {metadataKeyOptions && (
            <FormControl>
              <FormLabel style={{ width: "30em" }}>
                Select field/column containing sample names
              </FormLabel>
              <Select
                id="metadataKeySelect"
                variant="standard"
                //@ts-ignore
                onChange={(e) =>
                  dispatch({
                    type: "metadata match field selected",
                    data: e.target.value,
                  })
                }
                style={{ width: 200 }}
                size="small"
                value={state.metadataFieldToMatch}
              >
                {metadataKeyOptions.map((key: string) => (
                  <MenuItem value={key}>{key}</MenuItem>
                ))}
              </Select>
              <FormHelperText style={{ marginLeft: 0 }}>
                Used to match metadata rows
                <br />
                to samples in the tree.
              </FormHelperText>
            </FormControl>
          )}
        </p>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          disableElevation
          disableRipple
          onClick={(e) => {
            dispatch({ type: "upload submit button clicked" });
            navigate("/galago/app");
          }}
          disabled={
            !state.division ||
            !state.location ||
            !state.tree ||
            !state.mutsPerTransmissionMax
          }
        >
          Submit
        </Button>
      </DialogActions>
    </>
  );
};

export default UploadModal;
