import { get_leaves, get_root, find_leaf_by_name } from "../utils/treeMethods";

export const samplesOfInterestAC = () => {
  console.log("in parent function of samplesofinterestac");
  return function (dispatch: any, getState: Function) {
    console.log("inner function of samplesofinterestac");
    const state = getState();
    if (
      state.samplesOfInterestNames &&
      state.samplesOfInterestNames.length >= 2 &&
      state.tree
    ) {
      console.log("found all state variables");
      let all_leaves = get_leaves(get_root(state.tree));
      let _samplesOfInterest: Array<Node> = state.samplesOfInterestNames
        .map((n: string) => find_leaf_by_name(n, all_leaves))
        .filter((n: Node | null) => n !== null);

      if (_samplesOfInterest.length >= 2) {
        console.log("setting samples of interest to", _samplesOfInterest);
        console.log("dispatching submit button clicked");
        dispatch({ type: "submit button clicked", data: _samplesOfInterest });
        // setMrcaOptions(selectedSamplesToRoot(selected_sample_nodes, root));
      }
    } else {
      console.log(state);
    }
    return state;
  };
};

// export default samplesOfInterestAC;
