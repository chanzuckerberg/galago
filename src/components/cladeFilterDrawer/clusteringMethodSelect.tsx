import { Node } from "../../d";
import { nextstrainGeo, matutilsIntroduce } from "../../utils/clusterMethods";
import { useSelector, useDispatch } from "react-redux";
import { traverse_preorder, getNodeAttr } from "../../utils/treeMethods";
import { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from "@mui/material";
import Sidenote, { tooltipProps } from "../formatters/sidenote";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type ClusteringOptionsProps = {};

function ClusteringOptions(props: ClusteringOptionsProps) {
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);
  const metadataCensus = state.metadataCensus;
  const dispatch = useDispatch();

  const excludedFields = ["author", "div", "recency", "url", "tipCount"];
  const allNodes = traverse_preorder(state.tree).filter(
    (n: Node) => n.node_attrs.tipCount > 2
  );

  const checkNextstrainValidity = (field: string) => {
    if (
      !field ||
      excludedFields.includes(field) ||
      field.includes("date") // BUG - should be parsing dates as dates and not strings
    ) {
      return false;
    }
    return metadataCensus[field]["nextstrainAncestralTraitsComputed"];
  };

  // matutils values are calculated on the fly; can use any categorical attr from the leaves
  const checkMatutilsValidity = (field: string) => {
    if (!field || excludedFields.includes(field)) {
      return false;
    }
    if (metadataCensus[field]["matutilsAncestralTraitsComputed"]) {
      return true; // already computed
    }
    if (
      field.includes("_exposure") || // this is weird for exposure histories
      field.includes("date") || // BUG - should be parsing dates as dates and not strings
      metadataCensus[field]["dataType"] === "continuous" // must be categorical
    ) {
      return false;
    }
    return (
      metadataCensus[field]["uniqueValues"].length > 1 && // monophyletic, no changes to find
      metadataCensus[field]["uniqueValues"].length < 100 // too much computation
    );
  };

  const allFields = Object.keys(state.metadataCensus).filter(
    (field: string) =>
      checkNextstrainValidity(field) || checkMatutilsValidity(field)
  );

  const handleClusterMethod = (value: "none" | "matutils" | "nextstrain") => {
    dispatch({ type: "clustering method selected", data: value });
    if (value === "none") {
      dispatch({
        type: "clustering results updated",
        data: allNodes,
      });
    } else if (value === "matutils") {
      dispatch({
        type: "clustering results updated",
        data: matutilsIntroduce(state.tree, state.clusteringMetadataField),
      });
    } else {
      dispatch({
        type: "clustering results updated",
        data: nextstrainGeo(state.tree, state.clusteringMetadataField),
      });
    }
  };

  return (
    <div>
      <h2>
        Metadata-based clustering{" "}
        <Tooltip
          title={`Clustering algorithms help identify interesting
            clades to inspect based on where in the tree metadata attributes
            change. For example, clustering based on "location" can help
            identify clades that represent a new introduction to a given
            location.`}
          componentsProps={tooltipProps}
          arrow
        >
          <InfoOutlinedIcon
            sx={{
              position: "relative",
              top: 5,
              color: "#4f2379",
              fontSize: 20,
            }}
          />
        </Tooltip>
      </h2>
      <p>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            First, select metadata field to cluster on
          </FormLabel>
          <Select
            id="metadataFieldSelect"
            //@ts-ignore
            onChange={(event) => {
              dispatch({
                type: "clustering metadata field selected",
                data: event.target.value,
              });
            }}
            style={{ width: 200 }}
            size="small"
            defaultValue="Select a metadata field"
            value={state.clusteringMetadataField}
          >
            {allFields.map((field: string) => {
              return <MenuItem value={field}>{field}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </p>
      <p>
        <FormControl>
          <FormLabel>Then, select clustering algorithm</FormLabel>
          <RadioGroup
            aria-labelledby="select clustering method"
            name="radio-buttons-group"
            onChange={(e, v: string) =>
              //@ts-ignore
              handleClusterMethod(v)
            }
            value={state.clusteringMethod}
          >
            <FormControlLabel
              value="none"
              control={<Radio size="small" />}
              label="None"
            />
            <FormControlLabel
              value="nextstrain"
              control={
                <Radio
                  disabled={
                    !checkNextstrainValidity(state.clusteringMetadataField)
                  }
                  size="small"
                />
              }
              label="Treetime (recommended)"
            />

            <FormHelperText>
              <a href="https://academic.oup.com/ve/article/4/1/vex042/4794731">
                Treetime
              </a>{" "}
              is a model-based method. <br />
              Must be pre-computed upstream (outside of Galago).
            </FormHelperText>
            <FormControlLabel
              value="matutils"
              control={
                <Radio
                  disabled={
                    !checkMatutilsValidity(state.clusteringMetadataField)
                  }
                  size="small"
                />
              }
              label="Introduction Weight Heuristic"
            />
            <FormHelperText>
              <a href="https://academic.oup.com/ve/article/8/1/veac048/6609172">
                Introduction Weight
              </a>{" "}
              is a simple heuristic-based method. <br />
              Computed on demand (1 - 15 sec)
            </FormHelperText>
          </RadioGroup>
        </FormControl>
      </p>
    </div>
  );
}
export default ClusteringOptions;
