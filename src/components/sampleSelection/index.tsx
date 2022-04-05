import MutsDateScatter from "./mutsDateScatter";
import { CladeDescription, Node } from "../../d";
import React, { useState } from "react";
import { describe_clade } from "../../utils/describeClade";
import { get_leaves, get_root } from "../../utils/treeMethods";

type sampleSelectionProps = {
  tree: Node;
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
    setSelectedSamples,
    selectedSampleNames,
    setSelectedSampleNames,
    mrca,
    setMRCA,
  } = props;

  const handleSelectedSampleNames = (event: any) => {
    if (event && event.target) {
      let input_string: string = event.target.value;
      let sample_names: string[] = input_string
        .split(/[,\s]+/)
        .map((s: string) => s.trim());

      setSelectedSampleNames(sample_names);
    }
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
      }
    }
  };

  return (
    <p>
      <b>
        Finally, please enter sample IDs, separated by spaces, tabs or commas.
      </b>{" "}
      <br />
      <i>
        You should enter all the sample IDs in this tree that you believe may be
        associated with your potential outbreak of interest.
      </i>
      <br />
      <input
        type="text"
        name="selectedSamples"
        onChange={(e) => {
          handleSelectedSampleNames(e);
        }}
        style={{ width: "35em" }}
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
  );
}
export default SampleSelection;
