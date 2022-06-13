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

  const all_nodes: Array<Node> = traverse_preorder(state.tree);
  const all_internal_nodes: Array<Node> = all_nodes.filter(
    (node: Node) => node.children.length >= 2
  );
  const all_leaves: Array<Node> = all_nodes.filter(
    (node: Node) => node.children.length === 0
  );

  // Nextstrain attributes must be pre-computed upstream, which means that any valid attribute will have a value assigned to every internal node
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

  // matutils values are calculated on the fly; can use any categorical attr from the leaves
  const validateMatutilsAttr = (attr: string, all_leaves: Array<Node>) => {
    const excluded = ["author", "div", "recency", "url"];
    if (excluded.includes(attr) || attr.includes("_exposure")) {
      return false;
    }
    const allValidAttrValues = all_leaves.map((n: Node) =>
      getNodeAttr(n, attr)
    );
    const uniqueAttrValues = new Set(allValidAttrValues);
    if (
      uniqueAttrValues.size > 1 && // don't try to calc confidence scores for monophyletic traits
      uniqueAttrValues.size < 100 //&&
      // don't try to calc confidence scores for 100 different possible vals
      // [...uniqueAttrValues].every((val) => {
      // poor man's type checking for categorical values
      // ["undefined", "string"].includes(typeof val);
      // })
    ) {
      return true;
    } else {
      return false;
    }
  };

  // Matutils attributes are computed on the fly for internal nodes based on descendent leaves, so can take any attr that the leaves have (all leaves have the same attrs keys)
  // TODO: Put in proper logic for detecting categorical variables with 2 < n < 100 (whatever) unique values
  const matutilsAttrOptions = Object.keys(all_leaves[5].node_attrs).filter(
    (attr: string) => validateMatutilsAttr(attr, all_leaves)
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
          [Matutils] Changes in / movement between{" "}
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
            Heuristic-based method for tracking movement between facilities,
            states, etc. <br />
            Computed on demand; please be patient (1-15 seconds).
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
          [Nextstrain] Changes in / movement between{" "}
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
            Model-based method for tracking movement between facilities, states,
            etc. <br />
            Must be pre-computed upstream by Nextstrain.
          </span>
        </label>
      </p>
    </div>
  );
}
export default ClusteringOptions;
