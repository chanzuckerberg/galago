import { Node } from "../../d";
import { nextstrainGeo, matutilsIntroduce } from "../../utils/clusterMethods";
import { useSelector, useDispatch } from "react-redux";
import { traverse_preorder, getNodeAttr } from "../../utils/treeMethods";
import { useState } from "react";

function ClusteringOptions() {
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const [nextstrainAttr, setNextstrainAttr] = useState<string | undefined>(
    undefined
  );
  const [matutilsAttr, setMatutilsAttr] = useState<string | undefined>(
    undefined
  );

  const all_internal_nodes: Array<Node> = traverse_preorder(
    state.tree,
    (node: Node) => node.children.length >= 2
  );
  const nextstrainAttrOptions = Object.keys(
    all_internal_nodes[5].node_attrs
  ).filter(
    (attr: string) =>
      !["num_date", "div"].includes(attr) &&
      typeof all_internal_nodes[5] === "object" &&
      Object.keys(all_internal_nodes[5].node_attrs[attr]).includes(
        "confidence"
      ) &&
      nextstrainGeo(state.tree, attr).length > 5
  );

  // TODO: Put in proper logic for detecting categorical variables with 2 < n < 100 (whatever) unique values
  const matutilsAttrOptions = Object.keys(
    all_internal_nodes[5].node_attrs
  ).filter(
    (attr: string) =>
      typeof getNodeAttr(all_internal_nodes[5], attr) === "string"
  );

  return (
    <div>
      <h3>Choose a clustering method:</h3>
      <p>Select a method to suggest clusters of interest.</p>
      <p>
        <input
          type="radio"
          id="noClustering"
          name="clusteringOptionsRadio"
          value="none"
          defaultChecked
          onClick={() => {
            dispatch({
              type: "clustering results updated",
              data: all_internal_nodes,
            });
          }}
        />
        <label htmlFor="trimDeepNodes">None</label>
      </p>
      <p>
        <input
          type="radio"
          id="matutilsIntroduce"
          name="clusteringOptionsRadio"
          onClick={() => {
            dispatch({
              type: "clustering results updated",
              data: matutilsIntroduce(state.tree, matutilsAttr),
            });
          }}
          disabled={matutilsAttr === undefined}
        />
        <label htmlFor="matutilsIntroduce">
          Changes in / movement between{" "}
          <select
            id="matutils-attr-select"
            name="select"
            onChange={(e) => {
              setMatutilsAttr(e.target.value);
            }}
            disabled={matutilsAttrOptions.length === 0}
            style={{ width: "12em" }}
          >
            <option value={undefined}>choose metadata field</option>
            {matutilsAttrOptions.map((attr: string) => (
              <option value={attr}>{attr}</option>
            ))}
          </select>
          <br />
          <span style={{ fontSize: "0.8em", fontStyle: "italic" }}>
            Good for tracking movement between facilities, locations, etc.{" "}
            <br />
            Computed on demand; please be patient.
          </span>
        </label>
      </p>
      <p>
        <input
          type="radio"
          id="nextstrainGeo"
          name="clusteringOptionsRadio"
          onClick={() => {
            dispatch({
              type: "clustering results updated",
              data: nextstrainGeo(state.tree, nextstrainAttr),
            });
          }}
          disabled={nextstrainAttr === undefined}
        />
        <label htmlFor="nextstrainGeo">
          Changes in / movement between{" "}
          <select
            id="nextstrain-attr-select"
            name="select"
            onChange={(e) => {
              setNextstrainAttr(e.target.value);
            }}
            disabled={nextstrainAttrOptions.length === 0}
            style={{ width: "12em" }}
          >
            <option value={undefined}>choose metadata field</option>
            {nextstrainAttrOptions.map((attr: string) => (
              <option value={attr}>{attr}</option>
            ))}
          </select>
          <br />
          <span style={{ fontSize: "0.8em", fontStyle: "italic" }}>
            Best for tracking movement between facilities, locations, etc.{" "}
            <br />
            Must be pre-computed upstream by Nextstrain.
          </span>
        </label>
      </p>
    </div>
  );
}
export default ClusteringOptions;
