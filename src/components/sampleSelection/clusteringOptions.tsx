import { Node } from "../../d";
import { nextstrainGeo, trimDeepNodes } from "../../utils/clusterMethods";
import { useSelector, useDispatch } from "react-redux";
import { traverse_preorder } from "../../utils/treeMethods";
import { useState } from "react";

function ClusteringOptions() {
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const [nextstrainTrait, setNextstrainTrait] = useState<string | undefined>(
    undefined
  );

  const all_internal_nodes: Array<Node> = traverse_preorder(
    state.tree,
    (node: Node) => node.children.length >= 2
  );
  const nextstraintTraitOptions = Object.keys(
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
          id="trimDeepNodes"
          name="clusteringOptionsRadio"
          onClick={() => {
            dispatch({
              type: "clustering results updated",
              data: trimDeepNodes(state.tree),
            });
          }}
        />
        <label htmlFor="trimDeepNodes">
          Tree pruning
          <br />
          <span style={{ fontSize: "0.8em", fontStyle: "italic" }}>
            Least opinionated method. Removes large and deeply-nested clusters.
          </span>
        </label>
      </p>
      <p>
        <input
          type="radio"
          id="nextstrainGeo"
          name="clusteringOptionsRadio"
          value="phone"
          onClick={() => {
            dispatch({
              type: "clustering results updated",
              data: nextstrainGeo(state.tree, nextstrainTrait),
            });
          }}
          disabled={nextstrainTrait === undefined}
        />
        <label htmlFor="nextstrainGeo">
          Changes in / movement between{" "}
          <select
            id="nextstrain-trait-select"
            name="select"
            onChange={(e) => {
              setNextstrainTrait(e.target.value);
            }}
            disabled={nextstraintTraitOptions.length === 0}
            style={{ width: "12em" }}
          >
            <option value={undefined}>choose metadata field</option>
            {nextstraintTraitOptions.map((trait: string) => (
              <option value={trait}>{trait}</option>
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
