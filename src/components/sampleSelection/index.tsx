import MutsDateScatter from "./mutsDateScatter";
import ClusteringOptions from "./clusteringOptions";
import { CladeDescription, Node } from "../../d";
import React, { useState } from "react";
import { describe_clade } from "../../utils/describeClade";
import {
  get_leaves,
  get_root,
  find_leaf_by_name,
  traverse_preorder,
} from "../../utils/treeMethods";
import SamplesOfInterest from "./samplesOfInterest";

type sampleSelectionProps = {
  tree: Node;
  selectedSamples: Node[];
  setSelectedSamples: Function;
  selectedSampleNames: string[] | null;
  setSelectedSampleNames: Function;
  mrca: Node | null;
  setMRCA: Function;
};

export type internalNodeDataType = {
  name: string;
  date: Date;
  samples: string[];
  raw: Node;
};

function SampleSelection(props: sampleSelectionProps) {
  const {
    tree,
    selectedSamples,
    setSelectedSamples,
    selectedSampleNames,
    setSelectedSampleNames,
    mrca,
    setMRCA,
  } = props;

  // Catalog all internal nodes (i.e., "primary cases" / MRCAs of 2+ samples) in tree
  const all_internal_nodes: Array<Node> = traverse_preorder(
    tree,
    (node: Node) => node.children.length >= 2
  );

  // Map internal nodes --> [{name, date, descendents_names}]
  const internal_node_data: internalNodeDataType[] = [];
  all_internal_nodes.forEach((node: Node) => {
    internal_node_data.push({
      name: node.name,
      date: node.node_attrs.num_date.value,
      samples: get_leaves(node).map((l: Node) => l.name),
      raw: node,
    });
  });

  const [mrcaOptions, setMrcaOptions] =
    useState<internalNodeDataType[]>(internal_node_data);

  return (
    <div>
      <h2>Interactive sample selection</h2>
      <p>
        To instantly generate a report for any set of samples, select a cluster
        of samples based on the inferred primary case they descend from.
      </p>
      <SamplesOfInterest
        tree={tree}
        setSelectedSampleNames={setSelectedSampleNames}
        setSelectedSamples={setSelectedSamples}
        setMrcaOptions={setMrcaOptions}
        selectedSampleNames={selectedSampleNames}
      />
      <ClusteringOptions
        mrcaOptions={mrcaOptions}
        tree={tree}
        selectedSampleNames={selectedSampleNames}
        setSelectedSamples={setSelectedSamples}
        setSelectedSampleNames={setSelectedSampleNames}
        setMrcaOptions={setMrcaOptions}
      />
      <MutsDateScatter
        tree={tree}
        mrca={mrca}
        setMRCA={setMRCA}
        mrcaOptions={mrcaOptions}
        selectedSampleNames={selectedSampleNames}
      />
    </div>
  );
}
export default SampleSelection;
