import { ACTION_TYPES } from "./actionTypes";
import {
  get_leaves,
  get_root,
  find_leaf_by_name,
  get_mrca,
  getNodeAttr,
  traverse_preorder,
  determineIfInternalNodeDates,
} from "../utils/treeMethods";
import { ingestNextstrain } from "../utils/nextstrainAdapter";
import { CladeDescription, caseDefFilter, Node } from "../d";
import demo_sample_names from "../../data/demo_sample_names";
import { demoMetadata } from "../../data/demo_fake_metadata";
import { demo_tree } from "../../data/demo_tree";
import { getMrcaOptions } from "../utils/clusterMethods";
import {
  get_country_input_options,
  get_division_input_options,
  get_location_input_options,
} from "../utils/geoInputOptions";
import {
  ingestCSVMetadata,
  treeMetadataCensus,
  zipMetadataToTree,
} from "../utils/metadataUtils";
import { describe_clade } from "../utils/describeClade";
import { formatMrcaSliderOptionValue } from "../components/viz/cladeSelection/cladeSlider";
import {
  calcMutsPerTransmissionMax,
  pathogenParameters,
} from "../utils/pathogenParameters";
import { showErrorDefaults } from "src/utils/errorTypes";
import { GalagoParams } from "src/utils/fetchData";

const defaultState = {
  samplesOfInterestNames: [], // literally just the names of the samplesOfInterest
  samplesOfInterest: [], // array of Nodes, representing leaves that the user cares about
  mrca: null, // "most recent common ancestor" - root Node of the selected clade
  mrcaOptions: [], // Node objects representing mrcas that match both clustering algo suggestions (if any) andcontain at least one sample of interest (if any)
  clusteringMrcas: [], // Node objects that are suggested as relevant by the clustering algo (if any)
  tree: null, // root Node of the entire tree (only changes if json changes)
  haveInternalNodeDates: undefined,
  testValue: 0,
  metadataCensus: {},
  metadataEntries: [],
  metadataFieldToMatch: "",
  caseDefFilters: {},
  loadReport: false,
  cladeDescription: null,
  viewPlot: "scatter", // "scatter" | "unrootedTree"
  clusteringMethod: "none", // string
  clusteringMetadataField: undefined, // string | undefined
  heatmapSelectedSampleNames: [], // string[]
  cladeSliderValue: 0,
  cladeSliderField: "div",
  cacheStateOnFilterDrawerOpen: {},
  filterDrawerOpen: false,
  uploadModalOpen: false,
  location: "",
  division: "",
  country: "",
  countryOptions: [""],
  divisionOptions: [""],
  locationOptions: [""],
  pathogen: "",
  mutsPerTransmissionMax: "",
  fetchData: {
    // Everything around process of fetching data from external URL
    fetchInProcess: false, // App is fetching data (takes a few seconds)
    targetUrl: "", // URL we were given to fetch
    errorDuringFetch: false, // Was there an error around fetch process
  },
  treeTitle: "",
  showErrorMessages: showErrorDefaults,
};

export const global = (state = defaultState, action: any) => {
  switch (action.type) {
    case "call home": {
      return { ...state, testValue: state.testValue + 1 };
    }

    case "reset to default": {
      return defaultState;
    }

    case ACTION_TYPES.SHOW_TREE_FILE_SIZE_ERROR: {
      return {
        ...state,
        // should be the only tree or fetch-related error
        showErrorMessages: {
          ...state.showErrorMessages,
          treeErrors: {
            ...showErrorDefaults.treeErrors,
            treeFileTooBig: true,
          },
          fetchErrors: {
            ...showErrorDefaults.fetchErrors,
          },
        },
        tree: null,
        treeTitle: "JSON too big",
      };
    }

    case ACTION_TYPES.CLEAR_METADATA_FILE_SIZE_ERROR: {
      return {
        ...state,

        // clear only this metadata-related error
        showErrorMessages: {
          ...state.showErrorMessages,
          metadataErrors: {
            ...state.showErrorMessages.metadataErrors,
            metadataFileTooBig: false,
          },
        },
      };
    }

    case ACTION_TYPES.SHOW_TREE_FORMAT_ERROR: {
      return {
        ...state,
        showErrorMessages: {
          // should be the only tree or fetch-related error
          ...state.showErrorMessages,
          treeErrors: {
            ...showErrorDefaults.treeErrors,
            invalidJson: true,
          },
          fetchErrors: {
            ...showErrorDefaults.fetchErrors,
          },
        },
        tree: null,
        treeTitle: "Invalid JSON",
      };
    }

    case ACTION_TYPES.CLEAR_TREE_ERROR: {
      return {
        ...state,
        // clear only this error
        showErrorMessages: {
          ...state.showErrorMessages,
          treeErrors: {
            ...showErrorDefaults.treeErrors,
          },
        },
        treeTitle: "",
      };
    }

    case "pathogen selected": {
      return {
        ...state,
        pathogen: action.data,
        mutsPerTransmissionMax: "",
      };
    }

    case "mutsPerTransMax updated": {
      return {
        ...state,
        mutsPerTransmissionMax: action.data,
      };
    }

    case "upload modal opened": {
      return { ...state, uploadModalOpen: true };
    }

    case "upload modal closed": {
      return { ...state, uploadModalOpen: false };
    }

    case "filter drawer changes cancelled": {
      return {
        ...state,
        ...state.cacheStateOnFilterDrawerOpen, // overwrite state with what it was before the filter pane was opened
        cacheStateOnFilterDrawerOpen: {}, // discard cached state
        filterDrawerOpen: false,
      };
    }

    case "filter drawer changes applied": {
      return {
        ...state,
        cacheStateOnFilterDrawerOpen: {}, // just discard cached state
        filterDrawerOpen: false,
      };
    }

    // TODO: only cache the fields that could be altered in this drawer
    case "filter drawer opened": {
      // exclude the big pieces of data and clone the rest
      const { tree, metadataCensus, metadataEntries, ...cacheState } = state;

      return {
        ...state,
        cacheStateOnFilterDrawerOpen: cacheState,
        filterDrawerOpen: true,
      };
    }

    case "determined if internal node dates": {
      return {
        ...state,
        haveInternalNodeDates: action.data,
        cladeSliderField: action.data ? "num_date" : "div",
      };
    }

    case "view plot toggled": {
      return { ...state, viewPlot: action.data };
    }

    case "heatmap selected samples changed": {
      return { ...state, heatmapSelectedSampleNames: action.data };
    }

    case "clade slider value changed": {
      return { ...state, cladeSliderValue: action.data };
    }

    case "load demo": {
      const { tree, haveInternalNodeDates } = ingestNextstrain(demo_tree);
      const treeMetadata = treeMetadataCensus(tree);
      const samplesOfInterestNames = demo_sample_names
        .split(/[,\s]+/)
        .map((s: string) => s.trim());
      const samplesOfInterest = samplesOfInterestNames
        .map((n: string) => find_leaf_by_name(n, get_leaves(tree)))
        .filter((n: Node | null) => n !== null);
      //@ts-ignore -- we already check for null samples on the line above
      const mrca = get_mrca(samplesOfInterest);

      const { tidyMetadata, metadataCensus } = ingestCSVMetadata(demoMetadata);
      zipMetadataToTree(tree, tidyMetadata, "sample id");

      const cladeDescription = describe_clade(
        mrca,
        {
          location: "Humboldt County",
          division: "California",
          country: "USA",
        },
        1,
        // @ts-ignore
        samplesOfInterest
      );

      const cladeSliderField = haveInternalNodeDates ? "num_date" : "div";

      const sc2Parameters: any = pathogenParameters["sarscov2"];
      const mutsPerTransmissionMax = calcMutsPerTransmissionMax(
        sc2Parameters["genomeLength"],
        sc2Parameters["subsPerSitePerYear"],
        sc2Parameters["serialInterval"]
      );

      return {
        ...defaultState,
        tree: tree,
        showTreeFormatError: false,
        fetchData: { displayError: false },
        pathogen: "sarscov2",
        mutsPerTransmissionMax,
        haveInternalNodeDates,
        metadataEntries: tidyMetadata,
        metadataCensus: { ...treeMetadata, ...metadataCensus },
        metadataFieldToMatch: "sample id",
        samplesOfInterestNames,
        samplesOfInterest,
        mrca,
        //@ts-ignore -- we already check for null samples on the line above
        mrcaOptions: getMrcaOptions(tree, samplesOfInterest, []),
        location: "Humboldt County",
        division: "California",
        loadReport: true,
        cladeDescription,
        cladeSliderField,
        cladeSliderValue: formatMrcaSliderOptionValue(mrca, cladeSliderField),
      };
    }

    case "clustering metadata field selected": {
      return {
        ...state,
        clusteringMetadataField: action.data,
        mrcaOptions: state.tree
          ? getMrcaOptions(state.tree, state.samplesOfInterest, [])
          : [],
        clusteringMethod: "none",
      };
    }

    case "clustering method selected": {
      return {
        ...state,
        clusteringMethod: action.data,
      };
    }

    // issue: handle the case where a currently selected mrca isn't included in the list of clades returned by the algo
    case "clustering results updated": {
      if (state.tree) {
        const newMrcaOptions = getMrcaOptions(
          state.tree,
          state.samplesOfInterest,
          action.data
        );

        const newMrcaOptionNames = newMrcaOptions.map(
          (thisMrca: Node) => thisMrca.name
        );
        const newMrcaState =
          //@ts-ignore
          state.mrca && newMrcaOptionNames.includes(state.mrca.name)
            ? {}
            : {
                mrca: newMrcaOptions[0],
                heatmapSelectedSampleNames: [],
                cladeSliderValue: formatMrcaSliderOptionValue(
                  newMrcaOptions[0],
                  state.cladeSliderField
                ),
                cladeDescription: describe_clade(
                  newMrcaOptions[0],
                  {
                    location: state.location,
                    division: state.division,
                    country: state.country,
                  },
                  1,
                  state.samplesOfInterest
                ),
              };

        return {
          ...state,
          clusteringMrcas: action.data,
          mrcaOptions: newMrcaOptions,
          ...newMrcaState,
        };
      } else {
        return state;
      }
    }

    case "mrca selected": {
      if (!state.tree || !action.data) {
        return state;
      }
      const mrcaName = action.data;
      const mrca = find_leaf_by_name(mrcaName, traverse_preorder(state.tree));
      if (!mrca) {
        return state;
      }

      let cladeDescription: null | CladeDescription = state.cladeDescription;
      if (state.tree && state.location && state.division) {
        cladeDescription = describe_clade(
          mrca,
          {
            location: state.location,
            division: state.division,
            country: state.country,
          },
          1,
          state.samplesOfInterest
        );
      }

      return {
        ...state,
        mrca: mrca,
        cladeDescription: cladeDescription,
        heatmapSelectedSampleNames: [],
      };
    }

    case "samples of interest names changed": {
      return { ...state, samplesOfInterestNames: action.data };
    }

    case "samples of interest changed": {
      if (!state.tree) {
        return state;
      }
      const newSamplesOfInterest = action.data;
      return {
        ...state,
        samplesOfInterestNames: newSamplesOfInterest.map((n: Node) => n.name),
        samplesOfInterest: newSamplesOfInterest,
        mrcaOptions: getMrcaOptions(
          state.tree,
          //@ts-ignore - we already filter out null values above
          newSamplesOfInterest,
          state.clusteringMrcas
        ),
      };
    }

    case "tree file uploaded": {
      const { tree, treeTitle, haveInternalNodeDates } = action.data;

      const countryOptions = get_country_input_options(tree);
      const treeMetadata = treeMetadataCensus(tree);

      const cladeSliderField = haveInternalNodeDates ? "num_date" : "div";

      return {
        ...state,
        tree,
        treeTitle,
        countryOptions,
        showErrorMessages: {
          // successful tree upload should clear all tree and fetch errors
          ...state.showErrorMessages,
          treeErrors: { ...showErrorDefaults.treeErrors },
          fetchErrors: { ...showErrorDefaults.fetchErrors },
        },
        mrcaOptions: traverse_preorder(tree).filter(
          (node: Node) => node.children.length >= 2
        ),
        cladeSliderField,
        cladeSliderValue: formatMrcaSliderOptionValue(tree, cladeSliderField),
        mrca: tree,
        metadataCensus: { ...state.metadataCensus, ...treeMetadata },
        fetchData: {
          // edge case -- tried to fetch, errored, then uploaded manually -- clear fetch state including errors
          ...defaultState.fetchData,
        },
      };
    }

    case ACTION_TYPES.FETCH_TREE_DATA_STARTED: {
      const { targetUrl } = action;
      return {
        ...state,
        showErrorMessages: {
          // should clear all tree and fetch errors
          ...state.showErrorMessages,
          treeErrors: { ...showErrorDefaults.treeErrors },
          fetchErrors: { ...showErrorDefaults.fetchErrors },
        },
        fetchData: {
          ...state.fetchData,
          fetchInProcess: true,
          targetUrl,
        },
      };
    }

    case ACTION_TYPES.FETCH_ERROR_MSG_CLEAR: {
      return {
        ...state,
        showErrorMessages: {
          ...state.showErrorMessages,
          fetchErrors: { ...showErrorDefaults.fetchErrors },
        },
      };
    }

    case ACTION_TYPES.FETCH_TREE_DATA_SUCCEEDED: {
      // Primarily a copy of type "tree file uploaded", but fetch specific.
      // Handles query params, auto-open of upload modal, and fetch completion
      const { tree, haveInternalNodeDates, treeTitle } = action.data;
      const {
        pathogen: pathogenParam,
        // mrca: mrcaParam, TODO Uncomment and use when ready to handle
      } = action.galagoParams as GalagoParams;
      const countryOptions = get_country_input_options(tree);
      const treeMetadata = treeMetadataCensus(tree);
      const cladeSliderField = haveInternalNodeDates ? "num_date" : "div";

      const lowercasedPathogen = pathogenParam
        ? pathogenParam.toLowerCase()
        : "";
      return {
        ...state,
        tree: tree,
        treeTitle: treeTitle,
        showErrorMessages: {
          // should clear all tree and fetch errors
          ...state.showErrorMessages,
          treeErrors: { ...showErrorDefaults.treeErrors },
          fetchErrors: { ...showErrorDefaults.fetchErrors },
        },
        countryOptions: countryOptions,
        mrcaOptions: traverse_preorder(tree).filter(
          (node: Node) => node.children.length >= 2
        ),
        cladeSliderField: cladeSliderField,
        cladeSliderValue: formatMrcaSliderOptionValue(tree, cladeSliderField),
        mrca: tree, // TODO should be informed by mrcaParam from search params
        metadataCensus: { ...state.metadataCensus, ...treeMetadata },
        // Added portion for Fetch aspect starts here
        uploadModalOpen: true,
        pathogen: Object.keys(pathogenParameters).includes(lowercasedPathogen)
          ? lowercasedPathogen
          : "other",
        fetchData: {
          ...state.fetchData,
          fetchInProcess: false,
        },
      };
    }

    case ACTION_TYPES.FETCH_TREE_DATA_FAILED: {
      return {
        ...state,
        showErrorMessages: {
          // should be the only tree and/or fetch error
          ...state.showErrorMessages,
          treeErrors: { ...showErrorDefaults.treeErrors },
          fetchErrors: {
            ...showErrorDefaults.fetchErrors,
            fetchInvalidFile: true,
          },
        },
        fetchData: {
          ...state.fetchData,
          fetchInProcess: false,
          errorDuringFetch: true,
        },
      };
    }

    case ACTION_TYPES.FETCH_TREE_NO_URL_SPECIFIED: {
      return {
        ...state,
        showErrorMessages: {
          // should be the only tree and/or fetch error
          ...state.showErrorMessages,
          treeErrors: { ...showErrorDefaults.treeErrors },
          fetchErrors: {
            ...showErrorDefaults.fetchErrors,
            fetchUrlMissing: true,
          },
        },
        fetchData: {
          ...state.fetchData,
          fetchInProcess: false,
          errorDuringFetch: true,
        },
      };
    }

    case "country set": {
      if (state.tree) {
        const newDivisionOptions = get_division_input_options(
          state.tree,
          action.data
        );
        return {
          ...state,
          country: action.data,
          division: "",
          divisionOptions: newDivisionOptions,
          location: "",
        };
      }
    }

    case "division set": {
      if (state.tree && state.country) {
        const newLocationOptions = get_location_input_options(
          state.tree,
          action.data,
          state.country
        );
        return {
          ...state,
          division: action.data,
          location: "",
          locationOptions: newLocationOptions,
        };
      }
    }

    case "location set": {
      return {
        ...state,
        location: action.data,
      };
    }
    case "metadata uploaded and parsed": {
      const { tidyMetadata, metadataCensus } = action.data;

      return {
        ...state,
        metadataEntries: tidyMetadata,
        metadataCensus: { ...state.metadataCensus, ...metadataCensus },
      };
    }

    case "metadata match field selected": {
      if (action.data) {
        return {
          ...state,
          metadataFieldToMatch: action.data,
        };
      }
    }

    case "case definition filters cleared": {
      return { ...state, caseDefFilters: {} };
    }

    case "case definition filters updated": {
      const newFilter = action.data;
      const field = newFilter.field;
      let newState: { [key: string]: caseDefFilter } = {
        ...state.caseDefFilters,
      };

      if (newFilter.dataType === "continuous") {
        if (
          //@ts-ignore
          state.metadataCensus[field]["min"] === newFilter["min"] &&
          //@ts-ignore
          state.metadataCensus[field]["max"] === newFilter["max"]
        ) {
          delete newState[field]; // range is no longer restricted? remove filter
        } else {
          delete newFilter["field"];
          newState[field] = newFilter;
        }
      } else if (newFilter.dataType === "categorical") {
        //@ts-ignore
        if (
          newFilter.acceptedValues.length ===
            //@ts-ignore
            state.metadataCensus[field]["uniqueValues"].length ||
          newFilter.acceptedValues.length === 0
        ) {
          delete newState[field];
        } else {
          delete newFilter["field"];
          newState[field] = newFilter;
        }
      }
      return { ...state, caseDefFilters: newState };
    }

    case "case definition submitted": {
      return {
        ...state,
        samplesOfInterest: state.samplesOfInterest.concat(action.data),
        samplesOfInterestNames: state.samplesOfInterestNames.concat(
          action.data.map((n: Node) => n.name)
        ),
      };
    }

    case "upload submit button clicked": {
      if (state.tree && state.division && state.location && state.mrca) {
        let metadataStateUpdates: { [key: string]: any } = {};

        if (state.metadataEntries && state.metadataFieldToMatch && state.tree) {
          const updatedTree = zipMetadataToTree(
            state.tree,
            state.metadataEntries,
            state.metadataFieldToMatch
          );

          const haveInternalNodeDates =
            determineIfInternalNodeDates(updatedTree);

          const cladeSliderField = haveInternalNodeDates ? "num_date" : "div";
          metadataStateUpdates = {
            haveInternalNodeDates: haveInternalNodeDates,
            cladeSliderField: cladeSliderField,
            cladeSliderValue: formatMrcaSliderOptionValue(
              updatedTree,
              cladeSliderField
            ),
            mrca: updatedTree,
            tree: updatedTree,
            loadReport: true,
          };
        }

        const cladeDescription = describe_clade(
          metadataStateUpdates.mrca ? metadataStateUpdates.mrca : state.mrca,
          {
            location: state.location,
            division: state.division,
            country: state.country,
          },
          1,
          // @ts-ignore
          state.samplesOfInterest
        );

        return {
          ...state,
          ...metadataStateUpdates,
          cladeDescription: cladeDescription,
          loadReport: true,
        };
      }
    }

    default:
      return state;
  }
};
