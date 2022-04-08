import { CladeDescription, Node } from "../../d";
import React, { useState } from "react";
import {
  get_leaves,
  get_root,
  find_leaf_by_name,
  get_mrca,
  get_path,
} from "../../utils/treeMethods";
import { setIntersection } from "../../utils/misc";
import {
  nextstrainGeo,
  nodeToNodeData,
  trimDeepNodes,
} from "../../utils/clusterMethods";

type clusteringOptionsProps = {
  tree: Node;
  // selectedSamples: Node[];
  // mrcaOptions: internalNodeDataType[];
  setClusterMrcaOptions: Function;
};

export type internalNodeDataType = {
  name: string;
  date: Date;
  samples: string[];
  raw: Node;
};

function ClusteringOptions(props: clusteringOptionsProps) {
  const { tree, setClusterMrcaOptions } = props;

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
          onClick={setClusterMrcaOptions([])}
        />
        <label htmlFor="trimDeepNodes">None (show all primary cases)</label>
      </p>
      <p>
        <input
          type="radio"
    );
}
export default ClusteringOptions;
