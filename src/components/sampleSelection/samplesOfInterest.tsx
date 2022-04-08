import { internalNodeDataType } from "./clusteringOptions";
import {
  get_leaves,
  get_root,
  find_leaf_by_name,
  get_path,
} from "../../utils/treeMethods";
import { nodeToNodeData } from "../../utils/clusterMethods";
import { Node } from "../../d";

interface samplesOfInterestProps {
  tree: Node;
  setSelectedSampleNames: Function;
  setSelectedSamples: Function;
  // setMrcaOptions: Function;
  selectedSampleNames: string[] | null;
}

export const SamplesOfInterest = (props: samplesOfInterestProps) => {
  const {
    tree,
    setSelectedSampleNames,
    setSelectedSamples,
    // setMrcaOptions,
    selectedSampleNames,
  } = props;

  // const root = get_root(tree);

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
        // setMrcaOptions(selectedSamplesToRoot(selected_sample_nodes, root));
      }
    }
  };

  // const selectedSamplesToRoot = (nodes: Node[], root: Node) => {
  //   let all_mrca_options: Array<Node> = [];
  //   let seen_node_names: string[] = [];

  //   for (let i = 0; i < nodes.length; i++) {
  //     let this_path = get_path([root, nodes[i]]).path.filter(
  //       (n) => n.children.length > 0
  //     );

  //     this_path.forEach((n: Node) => {
  //       if (!seen_node_names.includes(n.name)) {
  //         seen_node_names.push(n.name);
  //         all_mrca_options.push(n);
  //       }
  //     });
  //   }

  //   return all_mrca_options.map((n: Node) => nodeToNodeData(n));
  // };

  return (
    <p>
      Optionally, input samples of interest to highlight them in the graph and
      eliminate inferred primary cases (and corresponding clusters) that are
      unrelated.
      <br />
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
        Highlight and subset
      </button>
    </p>
  );
};

export default SamplesOfInterest;
