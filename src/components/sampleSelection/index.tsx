import MutsDateScatter from "./mutsDateScatter";
import ClusteringOptions from "./clusteringOptions";
import { CladeDescription, Node } from "../../d";
import React, { useEffect, useState } from "react";
import { describe_clade } from "../../utils/describeClade";
import {
  get_leaves,
  get_root,
  find_leaf_by_name,
  traverse_preorder,
} from "../../utils/treeMethods";
import SamplesOfInterest from "./samplesOfInterest";
import { setIntersection } from "../../utils/misc";

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

  const [clusterMrcaOptions, setClusterMrcaOptions] =
    useState<internalNodeDataType[]>(internal_node_data);

  const [mrcaOptions, setMrcaOptions] =
    useState<internalNodeDataType[]>(internal_node_data);

  const handleSamplesOfInterestAndClusteringIntersection = (
    selectedSamples: Node[],
    clusterMrcaOptions: internalNodeDataType[]
  ) => {
    let newMrcaOptions: internalNodeDataType[] = [];
    const selectedSamplesSet = new Set(selectedSamples.map((s) => s.name));

    clusterMrcaOptions.forEach((n: internalNodeDataType) => {
      let leaves = get_leaves(n.raw).map((n) => n.name);
      if (setIntersection(new Set(leaves), selectedSamplesSet).size > 0) {
        newMrcaOptions.push(n);
      }
    });

    console.assert(
      newMrcaOptions.length > 0,
      "NO CLUSTERS CONTAIN ANY SAMPLES OF INTEREST!?"
    );
    return newMrcaOptions;
  };

  useEffect(() => {
    if (setSelectedSamples && clusterMrcaOptions) {
      setMrcaOptions(
        handleSamplesOfInterestAndClusteringIntersection(
          selectedSamples,
          clusterMrcaOptions
        )
      );
    } else {
      setMrcaOptions(internal_node_data);
    }
  }, [selectedSamples, clusterMrcaOptions]);

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
        // setMrcaOptions={setMrcaOptions}
        selectedSampleNames={selectedSampleNames}
      />
      <ClusteringOptions
        // mrcaOptions={mrcaOptions}
        tree={tree}
        // selectedSampleNames={selectedSampleNames}
        // setSelectedSamples={setSelectedSamples}
        // setSelectedSampleNames={setSelectedSampleNames}
        setClusterMrcaOptions={setClusterMrcaOptions}
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
