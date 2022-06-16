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
import { FormControl } from "@mui/material";

function ClusteringOptions() {
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);
  const metadataCensus = state.metadataCensus;
  const dispatch = useDispatch();

  const [metadataField, setMetadataField] = useState<string>("");

  const excludedFields = ["author", "div", "recency", "url"];
  const allNodes = traverse_preorder(state.tree).filter(
    (n: Node) => n.node_attrs.tipCount > 2
  );

  const checkNextstrainValidity = (field: string) => {
    if (!field || excludedFields.includes(field)) {
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
    if (value === "none") {
      dispatch({
        type: "clustering results updated",
        data: allNodes,
      });
    } else if (value === "matutils") {
      dispatch({
        type: "clustering results updated",
        data: matutilsIntroduce(state.tree, metadataField),
      });
    } else {
      dispatch({
        type: "clustering results updated",
        data: nextstrainGeo(state.tree, metadataField),
      });
    }
  };

  return (
    <div>
      <h2>Metadata-based clustering</h2>
      <p style={{ fontStyle: "italic", fontSize: 14 }}>
        You can think of clades as the hierarchical clusters that make up a
        phylogenetic tree. Clustering algorithms help identify interesting
        clades to inspect based on where in the tree metadata attributes change.
        For example, clustering based on "location" can help identify clades
        that represent a new introduction to a given location.
      </p>
      <ul style={{ fontStyle: "italic", fontSize: 14 }}>
        <li>
          Nextstrain is a model-based method (recommended) and must be
          pre-computed upstream (outside of Galago).
        </li>
        <li>
          Matutils is a heuristic-based method and is computed on demand (please
          be patient; 1 - 15 seconds){" "}
        </li>
      </ul>
      <p>
        <FormControl>
          <Select
            id="metadataFieldSelect"
            //@ts-ignore
            onChange={(event) => {
              setMetadataField(event.target.value);
            }}
            style={{ width: 200 }}
            size="small"
            defaultValue="Select a metadata field"
          >
            {allFields.map((field: string) => {
              return <MenuItem value={field}>{field}</MenuItem>;
            })}
          </Select>
          <FormHelperText>First, select a metadata field</FormHelperText>
        </FormControl>
      </p>
      <p>
        <FormControl>
          <ToggleButtonGroup
            // value={clusteringMethod}
            color="primary"
            exclusive
            onChange={(e, v) => handleClusterMethod(v)}
          >
            <ToggleButton value="none" defaultChecked={true} disableRipple>
              None
            </ToggleButton>
            <ToggleButton
              value="matutils"
              disableRipple
              disabled={!checkMatutilsValidity(metadataField)}
            >
              Matutils
            </ToggleButton>
            <ToggleButton
              value="nextstrain"
              disableRipple
              disabled={!checkNextstrainValidity(metadataField)}
            >
              Nextstrain
            </ToggleButton>
          </ToggleButtonGroup>
          <FormHelperText>
            Next, choose a method
            <br />
          </FormHelperText>
        </FormControl>
      </p>
    </div>
  );
}
export default ClusteringOptions;
