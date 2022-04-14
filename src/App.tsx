// TYPES
import { Node, CladeDescription, GISAIDRecord, GISAIDRawCounts } from "./d";
// HOOKS AND UTIL FUNCTIONS
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  get_root,
  get_leaves,
  find_leaf_by_name,
  get_mrca,
} from "./utils/treeMethods";
import {
  get_location_input_options,
  get_division_input_options,
} from "./utils/geoInputOptions";
import { describe_clade } from "./utils/describeClade";
// DATA
import { gisaid_counts_file } from "../data/gisaid_counts";
// COMPONENTS
import Header from "./components/header";
import AboutGalago from "./components/aboutGalago";
import ContactUs from "./components/contactUs";
import SamplingBias from "./components/sampleDistribTable";
import CladeDefinition from "./components/cladeDefinition";
import CladeUniqueness from "./components/cladeUniqueness";
import TMRCA from "./components/tmrca";
import OnwardTransmission from "./components/onwardTransmission";
import GeoSubclades from "./components/geoSubclades";
import Assumptions from "./components/assumptions";
import { SitStat } from "./components/sitStat";
import SampleSelection from "./components/sampleSelection";

function App() {
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  // LOCAL STATE
  const [clade_description, setCladeDescription] =
    useState<CladeDescription | null>(null);
  const [minMutsToParent, setMinMutsToParent] = useState<number>(1);
  const [mutsPerTransMinMax, setMutsPerTransMinMax] = useState<number[]>([
    0, 2,
  ]);

  const [locationInputOptions, setLocationInputOptions] = useState<
    string[] | null
  >(null);
  const [divisionInputOptions, setDivisionInputOptions] = useState<
    string[] | null
  >(null);

  const handleDivisionSelection = (event: any) => {
    if (event && event.target.value && state.tree) {
      const division = event.target.value;
      dispatch({ type: "division set", data: division });
      setLocationInputOptions(
        get_location_input_options(state.tree, state.division)
      );
    }
  };

  // DATA
  //@ts-ignore
  const gisaid_raw_counts = gisaid_counts_file;
  const gisaid_census = gisaid_raw_counts.data;

  // LOAD NARRATIVE
  useEffect(() => {
    if (state.tree && state.mrca && state.location && state.division) {
      setCladeDescription(
        describe_clade(
          state.mrca,
          {
            location: state.location,
            division: state.division,
            country: state.country,
            region: state.region,
          },
          mutsPerTransMinMax,
          minMutsToParent,
          state.samplesOfInterest
        )
      );
    }
  }, [state.tree, state.mrca, state.location, state.division]);

  // useEffect(() => {
  //   console.log("in new use effect", state);
  //   if (state.tree && state.country) {
  //     console.log("have all req state");
  //     setDivisionInputOptions(
  //       get_division_input_options(state.tree, state.country)
  //     );
  //   }
  // }, [state.tree]);

  return (
    <div>
      <Header />

      {(!state.tree || !state.location || !state.division) && (
        <div>
          <AboutGalago />
          <h2>Demo with real-world outbreak data</h2>
          <p>
            Genomic epidemiology helped public health officials understand a
            real-world outbreak of SARS-CoV-2 at a farm in Humboldt County. This
            demo report is automatically generated based on the same
            phylogenetic tree that was used in this investigation.
            <br />
            <a href="https://www.medrxiv.org/content/10.1101/2021.09.21.21258385v1">
              You can read more about this outbreak here.
            </a>
          </p>
          <p>
            <button
              type="button"
              name="loadDemo"
              onClick={() => dispatch({ type: "load demo" })}
            >
              Load Demo
            </button>{" "}
          </p>
          {/* <h2>Analyze a potential outbreak</h2>
          <p>
            <i>
              Galago runs entirely in the browser. This means that your data
              never leaves your computer and is never accessible to anyone else.
            </i>
          </p>
          <p>
            <b>First, please upload a tree file.</b>
            <br />
            <i>This must be in Nextstrain's JSON file format.</i>
            <input
              type="file"
              name="file"
              onChange={(event: any) =>
                dispatch({
                  type: "tree file uploaded",
                  data: event.target.files[0],
                })
              }
            />
          </p>
          <b>Next, please choose your location.</b>
          <br />
          <p>
            State:{" "}
            <select
              id="division-select"
              name="State"
              onChange={handleDivisionSelection}
              disabled={divisionInputOptions === null}
              style={{ width: "15em" }}
            >
              {divisionInputOptions &&
                divisionInputOptions.map((division: string) => (
                  <option value={division}>{division}</option>
                ))}
            </select>
          </p>
          <p>
            County:{" "}
            <select
              id="location-select"
              name="County"
              onChange={(event) => {
                dispatch({
                  type: "location set",
                  data: event.target.value,
                });
              }}
              disabled={locationInputOptions === null}
              style={{ width: "15em" }}
            >
              {locationInputOptions &&
                locationInputOptions.map((county: string) => (
                  <option value={county}>{county}</option>
                ))}
            </select>
          </p> */}
          <ContactUs />
        </div>
      )}
      {state.location && state.division && state.tree && (
        <div>
          <h1>Investigate potential outbreak clusters in {state.location}</h1>
          <SampleSelection tree={state.tree} />
        </div>
      )}

      {clade_description && state.tree && (
        <div>
          {/* <h2>Results</h2> */}
          <SitStat
            clade_description={clade_description}
            all_samples={get_leaves(state.tree)}
          />
          <CladeDefinition
            clade_description={clade_description}
            sidenote_start={1}
          />
          <TMRCA clade_description={clade_description} sidenote_start={3} />
          <GeoSubclades clade_description={clade_description} />
          <CladeUniqueness clade_description={clade_description} />
          <OnwardTransmission
            clade_description={clade_description}
            sidenote_start={6}
          />
          {/* <PhyloUncertainty clade_description={all_samples} /> */}
          {/* <h2>Considerations & Caveats</h2> */}
          <SamplingBias
            gisaid_census={gisaid_census}
            all_samples={get_leaves(get_root(state.tree))}
            clade_description={clade_description}
            sidenote_start={7}
          />
          <Assumptions
            clade_description={clade_description}
            sidenote_start={8}
          />
        </div>
      )}
    </div>
  );
}

export default App;
