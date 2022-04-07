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
import { nodeToNodeData, trimDeepNodes } from "../../utils/clusterMethods";

type clusteringOptionsProps = {
  tree: Node;
  selectedSamples: Node[];
  mrcaOptions: internalNodeDataType[];
  setMrcaOptions: Function;
};

export type internalNodeDataType = {
  name: string;
  date: Date;
  samples: string[];
  raw: Node;
};

function ClusteringOptions(props: clusteringOptionsProps) {
  const { tree, selectedSamples, mrcaOptions, setMrcaOptions } = props;

  const handleSamplesOfInterestAndClusteringIntersection = (
    selectedSamples: Node[],
    clusteringResults: internalNodeDataType[]
  ) => {
    let newMrcaOptions: internalNodeDataType[] = [];
    const selectedSamplesSet = new Set(selectedSamples.map((s) => s.name));

    clusteringResults.forEach((n: internalNodeDataType) => {
      let leaves = get_leaves(n.raw).map((n) => n.name);
      if (setIntersection(new Set(leaves), selectedSamplesSet).size > 0) {
        newMrcaOptions.push(n);
      }
    });

    console.assert(
      newMrcaOptions.length > 0,
      "NO CLUSTERS CONTAIN ANY SAMPLES OF INTEREST!?"
    );

    setMrcaOptions(newMrcaOptions);
  };

  return <div>"choose a clustering method"</div>;
}
export default ClusteringOptions;
