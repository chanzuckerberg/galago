import { CladeDescription, Node } from "../../d";
import React, { useState } from "react";
import {
  get_leaves,
  get_root,
  find_leaf_by_name,
  get_mrca,
  get_path,
} from "../../utils/treeMethods";

type clusteringOptionsProps = {
  tree: Node;
  selectedSampleNames: string[] | null;
  setSelectedSampleNames: Function;
  setSelectedSamples: Function;
  setMrcaOptions: Function;
};

export type internalNodeDataType = {
  name: string;
  date: Date;
  samples: string[];
  raw: Node;
};

function ClusteringOptions(props: clusteringOptionsProps) {
  const {
    tree,
    selectedSampleNames,
    setSelectedSamples,
    setSelectedSampleNames,
    setMrcaOptions,
  } = props;

  const root = get_root(tree);
  const handleSelectedSampleNames = (event: any) => {
    if (event && event.target) {
      let input_string: string = event.target.value;
      let sample_names: string[] = input_string
        .split(/[,\s]+/)
        .map((s: string) => s.trim());

      setSelectedSampleNames(sample_names);
    }
  };

  const nodeToNodeData = (node: Node) => {
    return {
      name: node.name,
      date: node.node_attrs.num_date.value,
      samples: get_leaves(node),
      raw: node,
    };
  };

  const selectedSamplesToRoot = (nodes: Node[], root: Node) => {
    let all_mrca_options: Array<Node> = [];
    let seen_node_names: string[] = [];

    for (let i = 0; i < nodes.length; i++) {
      let this_path = get_path([root, nodes[i]]).path.filter(
        (n) => n.children.length > 0
      );

      this_path.forEach((n: Node) => {
        if (!seen_node_names.includes(n.name)) {
          seen_node_names.push(n.name);
          all_mrca_options.push(n);
        }
      });
    }

    return all_mrca_options.map((n: Node) => nodeToNodeData(n));
  };

  const handleSelectedSamples = (event: any) => {
    if (selectedSampleNames && selectedSampleNames.length >= 2 && tree) {
      let all_leaves = get_leaves(get_root(tree));
      //@ts-ignore - we filter out any null values on the next line
      let selected_sample_nodes: Array<Node> = selectedSampleNames
        .map((n) => find_leaf_by_name(n, all_leaves))
        .filter((n) => n !== null);

      if (selected_sample_nodes.length >= 2) {
        setSelectedSamples(selected_sample_nodes);
        setMrcaOptions(selectedSamplesToRoot(selected_sample_nodes, root));
      }
    }
  };

  return (
    <div>
      {/* <h3>Suggest relevant primary cases (and corresponding samples)</h3> */}
      <p>
        Optionally, input samples of interest to highlight them in the graph and
        eliminate inferred primary cases that are unrelated.
        <input
          type="text"
          name="selectedSamples"
          onChange={(e) => {
            handleSelectedSampleNames(e);
          }}
          style={{ width: "35em" }}
          value={
            selectedSampleNames
              ? selectedSampleNames.join(", ")
              : "SampleID1, SampleID2, ..."
          }
          // value="SampleID1, SampleID2, ..."
        />
        <button
          type="button"
          name="submitInput"
          onClick={(e) => handleSelectedSamples(e)}
        >
          Submit
        </button>
      </p>
    </div>
  );
}
export default ClusteringOptions;
