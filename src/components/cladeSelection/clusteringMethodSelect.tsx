import { Node } from "../../d";
import { nextstrainGeo, matutilsIntroduce } from "../../utils/clusterMethods";
import { useSelector, useDispatch } from "react-redux";
import { traverse_preorder, getNodeAttr } from "../../utils/treeMethods";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

function ClusteringOptions() {
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);
  const metadataCensus = state.metadataCensus;
  const dispatch = useDispatch();

  const [metadataField, setMetadataField] = useState<string | undefined>(
    undefined
  );

  const excludedFields = ["author", "div", "recency", "url"];

  const checkNextstrainValidity = (field: string) => {
    return metadataCensus[field]["nextstrainAncestralTraitsComputed"];
  };

  // matutils values are calculated on the fly; can use any categorical attr from the leaves
  const checkMatutilsValidity = (field: string) => {
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

  return (
    <div>
      <h2>Clustering algorithms</h2>
      <p>Select a method to suggest clusters of interest.</p>

      {/* dispatch({
              type: "clustering results updated",
              data: all_internal_nodes,
            });

            dispatch({
              type: "clustering results updated",
              data: matutilsIntroduce(state.tree, matutilsAttr),
            });
          }} 
          
                      dispatch({
              type: "clustering results updated",
              data: nextstrainGeo(state.tree, nextstrainAttr),
            });
*/}
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
