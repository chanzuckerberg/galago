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
import { getMrcaOptions } from "../utils/clusterMethods";
import { get_location_input_options } from "../utils/geoInputOptions";
import { zipMetadataToTree } from "../utils/metadataUtils";

const defaultState = {
  samplesOfInterestNames: [],
  samplesOfInterest: [],
  mrca: null,
  mrcaOptions: [],
  clusteringMrcas: [],
  tree: null,
  location: "",
  division: "",
  country: "USA",
  region: "North America",
  testValue: 0,
  metadataCensus: {},
  metadataEntries: [],
  metadataFieldToMatch: "",
  loadReport: false,
  // cladeDescription: null,
};

export const global = (state = defaultState, action: any) => {
  switch (action.type) {
    case "call home": {
      return { ...state, testValue: state.testValue + 1 };
    }

    case "load demo": {
      const tree = ingestNextstrain(demo_tree);
      const samplesOfInterestNames = demo_sample_names
        .split(/[,\s]+/)
        .map((s: string) => s.trim());
      const samplesOfInterest = samplesOfInterestNames
        .map((n: string) => find_leaf_by_name(n, get_leaves(tree)))
        .filter((n: Node | null) => n !== null);
      //@ts-ignore -- we already check for null samples on the line above
      const mrca = get_mrca(samplesOfInterest);

      return {
        ...defaultState,
        tree: tree,
        samplesOfInterestNames: samplesOfInterestNames,
        samplesOfInterest: samplesOfInterest,
        mrca: mrca,
        //@ts-ignore -- we already check for null samples on the line above
        mrcaOptions: getMrcaOptions(tree, samplesOfInterest, []),
        location: "Humboldt County",
        division: "California",
        loadReport: true,
      };
    }

    case "clustering results updated": {
      if (state.tree) {
        return {
          ...state,
          clusteringMrcas: action.data,
          mrcaOptions: getMrcaOptions(
            state.tree,
            state.samplesOfInterest,
            action.data
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
          mrcaOptions: getMrcaOptions(
            state.tree,
            //@ts-ignore - we already filter out null values above
            newSamplesOfInterest,
            state.clusteringMrcas
          ),
        };
      } else {
        return state;
      }
    }

    case "tree file uploaded": {
      // console.log("setting tree to", action.data);
      return {
        ...state,
        tree: action.data,
      };
    }

    case "location set": {
      console.log("setting location to", action.data);
      return { ...state, location: action.data };
    }

    case "division set": {
      console.log("setting division to", action.data);
      if (state.tree) {
        const newLocationOptions = get_location_input_options(
          state.tree,
          action.data
        );
        return {
          ...state,
          division: action.data,
          locationOptions: newLocationOptions,
        };
      }
    }

    case "metadata uploaded and parsed": {
      const { tidyMetadata, metadataCensus } = action.data;

      return {
        ...state,
        metadataEntries: tidyMetadata,
        metadataCensus: { ...state.metadataCensus, ...metadataCensus },
      };
    }

    case "metadata field selected": {
      if (action.data) {
        return {
          ...state,
          metadataFieldToMatch: action.data,
        };
      }
    }

    case "submit button clicked": {
      if (state.tree && state.division && state.location) {
        if (state.metadataEntries && state.metadataFieldToMatch && state.tree) {
          const updatedTree = zipMetadataToTree(
            state.tree,
            state.metadataEntries,
            state.metadataFieldToMatch
          );
          return {
            ...state,
            tree: updatedTree,
            loadReport: true,
          };
        } else {
          return {
            ...state,
            loadReport: true,
          };
        }
      }
    }

    default:
      return state;
  }
};
