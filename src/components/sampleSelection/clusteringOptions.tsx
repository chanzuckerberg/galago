import { CladeDescription, Node } from "../../d";
import React, { useState } from "react";
import {
  get_leaves,
  get_root,
  find_leaf_by_name,
  get_mrca,
  get_path,
} from "../../utils/treeMethods";
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

  const root = get_root(tree);
  const handleSelectedSampleNames = (event: any) => {
    if (event && event.target) {
      let input_string: string = event.target.value;
      let sample_names: string[] = input_string
        .split(/[,\s]+/)

      setSelectedSampleNames(sample_names);
      }
  };

  const nodeToNodeData = (node: Node) => {
    return {
      name: node.name,
    );

      this_path.forEach((n: Node) => {
  };

  const handleSelectedSamples = (event: any) => {
}
export default ClusteringOptions;
