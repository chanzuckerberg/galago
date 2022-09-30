import { CladeDescription, Node } from "../d";
import { traverse_preorder } from "./treeMethods";

export const orderSamples = (mrca: Node, selectedSampleNames: string[]) => {
  return traverse_preorder(mrca) // closest to mrca first
    .filter(
      (
        n: Node // to be included
      ) => selectedSampleNames.includes(n.name)
    )
    .map((n: Node) => n.name); // names only
};

export const getDefaultSampleSet = (
  cladeDescription: CladeDescription,
  maxSamples: number = 50
) => {
  // first add as many samples of interest as we can fit
  let includedSamples: Array<Node> = cladeDescription.selected_samples.slice(
    0,
    maxSamples
  );

  // then fill in with other samples, again in order of increasing distance from the MRCA
  const remainingSpots = maxSamples - includedSamples.length;
  includedSamples = includedSamples.concat(
    cladeDescription.unselected_samples_in_cluster.slice(0, remainingSpots)
  );
  return includedSamples;
};
