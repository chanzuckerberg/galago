import {
  get_leaves,
  get_root,
  find_leaf_by_name,
  get_mrca,
} from "../utils/treeMethods";
import { ingestNextstrain } from "../utils/nextstrainAdapter";
import { Node } from "../d";
import demo_sample_names from "../../data/demo_sample_names";
import { demo_tree } from "../../data/demo_tree";
import {
  handleSamplesOfInterestAndClusteringIntersection,
  getSamplesOfInterestMrcas,
} from "../utils/clusterMethods";

const defaultState = {
  samplesOfInterestNames: [],
  samplesOfInterest: [],
  mrca: null,
  mrcaOptions: [],
  tree: null,
  location: "",
  division: "",
  country: "USA",
  region: "North America",
  cladeDescription: null,
};

export const global = (state = defaultState, action: any) => {
  switch (action.type) {
    case "load demo": {
      const tree = ingestNextstrain(demo_tree);
      const samplesOfInterestNames = demo_sample_names
        .split(/[,\s]+/)
        .map((s: string) => s.trim());
      const samplesOfInterest = samplesOfInterestNames
        .map((n: string) => find_leaf_by_name(n, get_leaves(tree)))
        .filter((n: Node | null) => n !== null);
      const mrca = get_mrca(samplesOfInterest);

      return {
        ...defaultState,
        tree: tree,
        samplesOfInterestNames: samplesOfInterestNames,
        samplesOfInterest: samplesOfInterest,
        mrca: mrca,
        mrcaOptions: getSamplesOfInterestMrcas(samplesOfInterest, tree),
        location: "Humboldt County",
        division: "California",
      };
    }

    case "clustering results updated": {
      if (state.samplesOfInterest && state.tree) {
        return {
          ...state,
          mrcaOptions: handleSamplesOfInterestAndClusteringIntersection(
            state.samplesOfInterest,
            action.data,
            state.tree
          ),
        };
      } else {
        return state;
      }
    }

    case "mrca clicked": {
      return { ...state, mrca: action.data };
    }

    case "sample names string changed": {
      const input_string: string = action.data;
      const sample_names: string[] = input_string
        .split(/[,\s]+/)
        .map((s: string) => s.trim());
      console.log("setting sample names to ", sample_names);
      return { ...state, samplesOfInterestNames: sample_names };
    }

    case "sample submit button clicked": {
      if (state.samplesOfInterestNames && state.tree) {
        let all_leaves = get_leaves(get_root(state.tree));
        const newSamplesOfInterest = state.samplesOfInterestNames
          .map((n: string) => find_leaf_by_name(n, all_leaves))
          .filter((n: Node | null) => n !== null);
        return {
          ...state,
          samplesOfInterest: newSamplesOfInterest,
        };
      } else {
        return state;
      }
    }

    case "tree file uploaded": {
      const fileReader = new FileReader();

      fileReader.readAsText(action.data, "application/JSON");
      fileReader.onload = (event) => {
        if (event?.target?.result && typeof event.target.result === "string") {
          const newTree: Node = ingestNextstrain(
            JSON.parse(event.target.result)
          );
          console.log("setting tree from file upload", newTree);
          return { ...state, tree: newTree };
        }
      };
    }

    case "location set": {
      console.log("setting location to", action.data);
      return { ...state, location: action.data };
    }

    case "division set": {
      console.log("setting division to", action.data);
      return { ...state, division: action.data };
    }

    default:
      return state;
  }
};
