import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
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

  const futureUserInput = {
    home_geo: {
      location: "Alameda County",
      division: "California",
      country: "USA",
      region: "North America",
    },
    min_muts_to_parent: 1,
    muts_per_trans_minmax: [0, 2],
  };

  const initializeReport = (
    selectedSamples: Node[],
    tree: Node,
    home_geo: {
      location: string;
      division: string;
      country: string;
      region?: string;
    } = futureUserInput["home_geo"],
    min_muts_to_parent: number = futureUserInput["min_muts_to_parent"],
    muts_per_trans_minmax: number[] = futureUserInput["muts_per_trans_minmax"]
  ) => {
    setCladeDescription(
      describe_clade(
        selectedSamples,
        home_geo,
        muts_per_trans_minmax,
        min_muts_to_parent
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

  if (tree && selectedSamples && !clade_description) {
    initializeReport(selectedSamples, tree);
  }

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`Home — Galago`}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <p
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          fontSize: 24,
          margin: 0,
        }}
      >
        Galago
      </p>
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
          <p>
            <b>
              Next, please enter sample IDs, separated by spaces, tabs or
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
              style={{ width: "20em" }}
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
