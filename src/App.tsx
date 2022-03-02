import React, { useState, useEffect } from "react";
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
import { gisaid_counts_file } from "../data/gisaid_counts";
import { ingestNextstrain } from "./utils/nextstrainAdapter";
import { Node, CladeDescription, GISAIDRecord, GISAIDRawCounts } from "./d";
import { describe_clade } from "./utils/describeClade";
import { get_root, get_leaves, find_leaf_by_name } from "./utils/treeMethods";
import {
  get_location_input_options,
  get_division_input_options,
} from "./utils/geoInputOptions";

function App() {
  //@ts-ignore
  const gisaid_raw_counts: GISAIDRawCounts = gisaid_counts_file;
  const gisaid_census: GISAIDRecord[] = gisaid_raw_counts.data;

  const [tree, setTree] = useState<null | Node>(null);
  const [selectedSampleNames, setSelectedSampleNames] = useState<
    string[] | null
  >(null);
  const [selectedSamples, setSelectedSamples] = useState<Node[] | null>(null);
  const [clade_description, setCladeDescription] =
    useState<CladeDescription | null>(null);
  const [locationInputOptions, setLocationInputOptions] = useState<
    string[] | null
  >(null);
  const [divisionInputOptions, setDivisionInputOptions] = useState<
    string[] | null
  >(null);
  const [location, setLocation] = useState<string | null>(null);
  const [division, setDivision] = useState<string | null>(null);

  const futureUserInput = {
    home_geo: {
      country: "USA",
      region: "North America",
    },
    min_muts_to_parent: 1,
    muts_per_trans_minmax: [0, 2],
  };

  const initializeReport = (
    selectedSamples: Node[],
    tree: Node,
    location: string,
    division: string,
    futureUserInput: any
  ) => {
    const home_geo = {
      location: location,
      division: division,
      country: futureUserInput.home_geo["country"],
      region: futureUserInput.home_geo["region"],
    };

    setCladeDescription(
      describe_clade(
        selectedSamples,
        home_geo,
        futureUserInput["muts_per_trans_minmax"],
        futureUserInput["min_muts_to_parent"]
      )
    );
  };

  const handleTreeUpload = (event: any) => {
    const fileReader = new FileReader();

    fileReader.readAsText(event.target.files[0], "application/JSON");
    fileReader.onload = (event) => {
      if (event?.target?.result && typeof event.target.result === "string") {
        const tree: Node = ingestNextstrain(JSON.parse(event.target.result));
        setTree(tree);
        setDivisionInputOptions(get_division_input_options(tree, "USA"));
      }
    };
  };

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

  const handleDivisionSelection = (event: any) => {
    if (event && event.target.value && tree) {
      const division = event.target.value;
      setDivision(division);
      setLocationInputOptions(get_location_input_options(tree, division));
    }
  };

  const handleLocationSelection = (event: any) => {
    if (event && event.target.value) {
      setLocation(event.target.value);
    }
  };

  if (tree && selectedSamples && location && division && !clade_description) {
    initializeReport(
      selectedSamples,
      tree,
      location,
      division,
      futureUserInput
    );
  }

  return (
    <div>
      <Header />

      {!clade_description ? (
        <div>
          <AboutGalago />
          <h2>Analyze a potential outbreak</h2>
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
            <input type="file" name="file" onChange={handleTreeUpload} />
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
              onChange={handleLocationSelection}
              disabled={locationInputOptions === null}
              style={{ width: "15em" }}
            >
              {locationInputOptions &&
                locationInputOptions.map((county: string) => (
                  <option value={county}>{county}</option>
                ))}
            </select>
          </p>

          <p>
            <b>
              Finally, please enter sample IDs, separated by spaces, tabs or
              commas.
            </b>{" "}
            <br />
            <i>
              You should enter all the sample IDs in this tree that you believe
              may be associated with your potential outbreak of interest.
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
          <ContactUs />
        </div>
      ) : (
        <></>
      )}
      {clade_description && tree && (
        <div>
          <h1>
            Genomic Investigation of a Potential Outbreak
            <br />
            in {clade_description.home_geo.location}
          </h1>
          {/* <h2>Results</h2> */}
          <CladeDefinition clade_description={clade_description} />
          <TMRCA clade_description={clade_description} />
          <CladeUniqueness clade_description={clade_description} />
          <GeoSubclades clade_description={clade_description} />
          <OnwardTransmission clade_description={clade_description} />
          {/* <PhyloUncertainty clade_description={all_samples} /> */}
          {/* <h2>Considerations & Caveats</h2> */}
          <SamplingBias
            gisaid_census={gisaid_census}
            all_samples={get_leaves(get_root(tree))}
            clade_description={clade_description}
          />
          <Assumptions clade_description={clade_description} />
          {/* <MinIntroductions clade_description={clade_description} /> */}
        </div>
      )}
    </div>
  );
}

export default App;
