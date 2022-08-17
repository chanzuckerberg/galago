import { CladeDescription, Node } from "../d";
import { traverse_preorder } from "./treeMethods";

export const getDefaultSampleSet = (
  cladeDescription: CladeDescription,
  maxSamples: number = 50
) => {
  // first add as many samples of interest as we can fit
  let includedSampleNames: Array<string> = cladeDescription.selected_samples
    .slice(0, 50)
    .map((n: Node) => n.name);
  // console.log("found N samples of interest", includedSampleNames);
  // then fill in with other samples, again in order of increasing distance from the MRCA
  const remainingSpots = maxSamples - includedSampleNames.length;
  includedSampleNames = includedSampleNames.concat(
    cladeDescription.unselected_samples_in_cluster
      .slice(0, remainingSpots)
      .map((n: Node) => n.name)
  );
  return includedSampleNames;
};
