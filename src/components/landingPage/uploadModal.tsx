import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//@ts-ignore
import { parse } from "papaparse";
import { ingestCSVMetadata } from "../../utils/metadataUtils";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
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
import { ROUTES } from "../../routes";
import { maxFileSize } from "../../utils/dataIngest";
import { ACTION_TYPES } from "../../reducers/actionTypes";

export const UploadModal = () => {
  // @ts-ignore -- one day I will learn how to `type` all my state variables, but that day is not today
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [metadataKeyOptions, setMetadataKeyOptions] = useState<null | string[]>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleMetadataUpload = (file: any) => {
    if (file.size > maxFileSize) {
      dispatch({ type: ACTION_TYPES.SHOW_METADATA_FILE_SIZE_ERROR });
      return;
    }
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
        <h3>Tree uploaded</h3>
        <FormLabel>{state.treeTitle}</FormLabel>
        <h3>Select pathogen (required)</h3>

        <p>
          <PathogenSelection loading={loading} />
        </p>
        {state.tree && state.countryOptions && (
          <>
            <h3>Select your location of interest (optional)</h3>
            <FormLabel>
              Setting your location of interest enables you to highlight samples
              from this location and identify pathogen movement between
              locations.
            </FormLabel>
            <p>
              <FormControl>
                <FormLabel>Country</FormLabel>
                <Select
                  variant="standard"
                  id="countrySelect"
                  //@ts-ignore
                  onChange={(e) =>
                    dispatch({ type: "country set", data: e.target.value })
                  }
                  style={{ width: 200 }}
                  size="small"
                  disabled={!state.countryOptions || loading}
                  value={state.country}
                >
                  {state.countryOptions &&
                    state.countryOptions.map((country: string) => (
                      <MenuItem value={country}>{country}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </p>
          </>
        )}
        {state.country && state.divisionOptions && (
          <p>
            <FormControl>
              <FormLabel>State / Province</FormLabel>
              <Select
                variant="standard"
                id="divisionSelect"
                //@ts-ignore
                onChange={(e) =>
                  dispatch({ type: "division set", data: e.target.value })
                }
                style={{ width: 200 }}
                size="small"
                disabled={!state.divisionOptions || loading}
                value={state.division}
              >
                {state.divisionOptions &&
                  state.divisionOptions.map((division: string) => (
                    <MenuItem value={division}>{division}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </p>
        )}
        {state.country && state.division && state.locationOptions && (
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
                disabled={!state.locationOptions || loading}
                variant="standard"
                value={state.location}
                style={{ width: 200 }}
                size="small"
              >
                {state.locationOptions.map((loc: string) => (
                  <MenuItem value={loc}>{loc}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </p>
        )}

        <h3>Upload sample metadata, e.g. a line list (optional)</h3>
        <FormLabel>
          If provided, epi metadata helps you identify more meaningful clusters.
        </FormLabel>
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
              disabled={loading}
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
                disabled={loading}
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
            setLoading(true);
            dispatch({ type: "upload submit button clicked" });
            navigate(ROUTES.APP);
          }}
          disabled={!state.tree || !state.mutsPerTransmissionMax}
        >
          {loading && (
            <CircularProgress
              size={20}
              sx={{ color: "white", marginRight: 1 }}
            />
          )}
          Submit
        </Button>
      </DialogActions>
    </>
  );
};

export default UploadModal;
