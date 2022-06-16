import { Node } from "../../d";
import { nextstrainGeo, matutilsIntroduce } from "../../utils/clusterMethods";
import { useSelector, useDispatch } from "react-redux";
import { traverse_preorder, getNodeAttr } from "../../utils/treeMethods";
import { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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
  console.log("metadata census", state.metadataCensus, "allFields", allFields);

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
      <p style={{ fontSize: 12, fontStyle: "italic" }}>
        Select a method to suggest clusters where{" "}
        {metadataField
          ? `${metadataField} has changed.`
          : "metadata values change (e.g., which correspond to movement between locations)."}
      </p>
      <p>
        <Select
          id="metadataFieldSelectdemo-simple-select-standard"
          value={metadataField}
          onChange={(e, v) => console.log(e, v)}
          label="Metadata field"
        >
          {allFields.map((field: string) => {
            return <MenuItem value={field}>{field}</MenuItem>;
          })}
        </Select>
      </p>
      <p>
        <ToggleButtonGroup
          // value={clusteringMethod}
          exclusive
          onChange={(e, v) => console.log(e, v)} //handleClusterMethod}
          aria-label="text alignment"
        >
          <ToggleButton
            value="none"
            aria-label="left aligned"
            defaultChecked={true}
          >
            None
          </ToggleButton>
          <ToggleButton
            value="matutils"
            aria-label="centered"
            disabled={!checkMatutilsValidity(metadataField)}
          >
            Matutils
          </ToggleButton>
          <ToggleButton
            value="nextstrain"
            aria-label="right aligned"
            disabled={!checkNextstrainValidity(metadataField)}
          >
            Nextstrain
          </ToggleButton>
        </ToggleButtonGroup>
      </p>

      {/* example new select from docs */}
      {/* <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}> */}
      {/* <InputLabel id="matutils-attr-select">Foo</InputLabel>
      <Select
        labelId="matutils-attr-select"
        id="demo-simple-select-standard"
        value={"metadata field"}
        onChange={(e, v) => console.log(e, v)}
        label="Age"
      /> */}
      {/* <span style={{ fontSize: "0.8em", fontStyle: "italic" }}>
        Heuristic-based method for tracking movement between facilities, states,
        etc. <br />
        Computed on demand; please be patient (1-15 seconds).
      </span>
      <span style={{ fontSize: "0.8em", fontStyle: "italic" }}>
        Model-based method for tracking movement between facilities, states,
        etc. <br />
        Must be pre-computed upstream by Nextstrain.
      </span> */}
    </div>
  );
}
export default ClusteringOptions;
