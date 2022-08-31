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

const defaultState = {
  samplesOfInterestNames: [], // literally just the names of the samplesOfInterest
  samplesOfInterest: [], // array of Nodes, representing leaves that the user cares about
  mrca: null, // "most recent common ancestor" - root Node of the selected clade
  mrcaOptions: [], // Node objects representing mrcas that match both clustering algo suggestions (if any) andcontain at least one sample of interest (if any)
  clusteringMrcas: [], // Node objects that are suggested as relevant by the clustering algo (if any)
  tree: null, // root Node of the entire tree (only changes if json changes)
  haveInternalNodeDates: undefined,
  location: "",
  division: "",
  country: "USA",
  region: "North America",
  testValue: 0,
  metadataCensus: {},
  metadataEntries: [],
  metadataFieldToMatch: "",
  caseDefFilters: {},
  samplesMatchingCaseDef: [],
  loadReport: false,
  cladeDescription: null,
  viewPlot: "scatter", // "scatter" | "forceGraph"
  clusteringMethod: "none", // string
  clusteringMetadataField: undefined, // string | undefined
  heatmapSelectedSampleNames: [], // string[]
  cladeSliderValue: 0,
  cladeSliderField: "div",
  cacheStateOnFilterDrawerOpen: {},
  filterDrawerOpen: false,
  uploadModalOpen: false,
  divisionOptions: [""],
  pathogen: "",
  mutsPerTransmissionMax: "",
};

export const global = (state = defaultState, action: any) => {
  switch (action.type) {
    case "call home": {
      return { ...state, testValue: state.testValue + 1 };
    }

    case "reset to default": {
      return defaultState;
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

    case "filter drawer opened": {
      return {
        ...state,
        cacheStateOnFilterDrawerOpen: state,
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
      // TODO: this should all probably live in an thunk + action constructor instead of duplicating code from a bunch of individual reducers. But, they're all short and this gets us off the ground for now.
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
          region: "North America",
        },
        1,
        // @ts-ignore
        samplesOfInterest
      );

      const cladeSliderField = haveInternalNodeDates ? "num_date" : "div";

      return {
        ...defaultState,
        tree: tree,
        pathogen: "sarscov2",
        haveInternalNodeDates: haveInternalNodeDates,
        metadataEntries: tidyMetadata,
        metadataCensus: { ...treeMetadata, ...metadataCensus },
        metadataFieldToMatch: "sample id",
        samplesOfInterestNames: samplesOfInterestNames,
        samplesOfInterest: samplesOfInterest,
        mrca: mrca,
        //@ts-ignore -- we already check for null samples on the line above
        mrcaOptions: getMrcaOptions(tree, samplesOfInterest, []),
        location: "Humboldt County",
        division: "California",
        loadReport: true,
        cladeDescription: cladeDescription,
        cladeSliderField: cladeSliderField,
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
                    region: state.region,
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
            region: state.region,
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
      const { tree, haveInternalNodeDates } = action.data;

      const divisionOptions = get_division_input_options(tree, state.country);
      const treeMetadata = treeMetadataCensus(tree);

      const cladeSliderField = haveInternalNodeDates ? "num_date" : "div";

      return {
        ...state,
        tree: tree,
        divisionOptions: divisionOptions,
        mrcaOptions: traverse_preorder(tree).filter(
          (node: Node) => node.children.length >= 2
        ),
        cladeSliderField: cladeSliderField,
        cladeSliderValue: formatMrcaSliderOptionValue(tree, cladeSliderField),
        mrca: tree,
        metadataCensus: { ...state.metadataCensus, ...treeMetadata },
      };
    }

    case "location set": {
      return {
        ...state,
        location: action.data,
      };
    }

    case "division set": {
      if (state.tree) {
        const newLocationOptions = get_location_input_options(
          state.tree,
          action.data
        );
        return {
          ...state,
          division: action.data,
          location: "",
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

    case "metadata match field selected": {
      if (action.data) {
        return {
          ...state,
          metadataFieldToMatch: action.data,
        };
      }
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
          state.metadataCensus[field]["min"] === newFilter["max"] &&
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
      if (state.tree && state.caseDefFilters) {
        let matchingSamples: Node[] = get_leaves(state.tree);
        if (Object.keys(state.caseDefFilters).length === 0) {
          return { ...state, samplesMatchingCaseDef: matchingSamples };
        }

        for (let i = 0; i < Object.entries(state.caseDefFilters).length; i++) {
          let thisFilter = Object.entries(state.caseDefFilters)[i];

          //@ts-ignore
          if (thisFilter[1]["dataType"] === "categorical") {
            //@ts-ignore
            matchingSamples = matchingSamples.filter((n: Node) =>
              //@ts-ignore
              thisFilter[1]["acceptedValues"].includes(
                getNodeAttr(n, thisFilter[0])
              )
            );
          } else {
            //@ts-ignore
            matchingSamples = matchingSamples.filter(
              (n: Node) =>
                //@ts-ignore
                getNodeAttr(n, thisFilter[0]) <= thisFilter[1]["max"] &&
                getNodeAttr(
                  n,
                  //@ts-ignore
                  thisFilter[0]
                  //@ts-ignore
                ) >= thisFilter[1]["min"]
            );
          }
        }

        matchingSamples = matchingSamples.filter(
          //@ts-ignore - wtf is this one
          (n: Node) => !state.samplesOfInterestNames.includes(n.name)
        );
        const matchingSampleNames = matchingSamples.map((n: Node) => n.name);

        return {
          ...state,
          //@ts-ignore
          samplesOfInterest: state.samplesOfInterest.concat(matchingSamples),
          samplesOfInterestNames:
            //@ts-ignore
            state.samplesOfInterestNames.concat(matchingSampleNames),
        };
      }
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
            region: state.region,
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
