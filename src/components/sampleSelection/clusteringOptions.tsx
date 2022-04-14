import { Node } from "../../d";
import { nextstrainGeo, trimDeepNodes } from "../../utils/clusterMethods";
import { useSelector, useDispatch } from "react-redux";
import { traverse_preorder } from "../../utils/treeMethods";

function ClusteringOptions() {
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const all_internal_nodes: Array<Node> = traverse_preorder(
    state.tree,
    (node: Node) => node.children.length >= 2
  );

  return (
    <div>
      <p>Choose a clustering method:</p>
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
        <label htmlFor="trimDeepNodes">None (show all primary cases)</label>
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
        <label htmlFor="trimDeepNodes">Tree pruning (most basic)</label>
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
              data: nextstrainGeo(state.tree, "location"),
            });
          }}
          disabled
        />
        <label htmlFor="nextstrainGeo">
          Geographic movement (Nextstrain inference)
        </label>
      </p>
    </div>
  );
}
export default ClusteringOptions;
