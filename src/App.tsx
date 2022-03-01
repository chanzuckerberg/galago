import React, { useState } from "react";
import { Helmet } from "react-helmet";
import AboutGalago from "./components/aboutGalago";
import ContactUs from "./components/ContactUs";
import SamplingBias from "./components/sampleDistribTable";
import CladeDefinition from "./components/cladeDefinition";
import CladeUniqueness from "./components/cladeUniqueness";
import TMRCA from "./components/tmrca";
import OnwardTransmission from "./components/onwardTransmission";
import GeoSubclades from "./components/geoSubclades";
import Assumptions from "./components/assumptions";
import { gisaid_counts_file } from "../stub_data/gisaid_counts";
import { ingestNextstrain } from "./utils/nextstrainAdapter";
import { Node, CladeDescription, GISAIDRecord, GISAIDRawCounts } from "./d";
import { describe_clade } from "./utils/describeClade";
import { get_root, get_leaves, find_leaf_by_name } from "./utils/treeMethods";

function App() {
  //@ts-ignore
  const gisaid_raw_counts: GISAIDRawCounts = gisaid_counts_file;
  const gisaid_census: GISAIDRecord[] = gisaid_raw_counts.data;

  const [tree, setTree] = useState<null | Node>(null);
  const [isFilePicked, setIsFilePicked] = useState<boolean>(false);
  const [selectedSamples, setSelectedSamples] = useState<Node[] | null>(null);
  // const [selectedSamples, setSelectedSamples] = useState<string | null>(null);
  const [clade_description, setCladeDescription] =
    useState<CladeDescription | null>(null);

  const futureUserInput = {
    home_geo: {
      location: "Alameda County",
      division: "California",
      country: "USA",
      region: "North America",
    },
    selectedSamples: null,
    min_muts_to_parent: 1,
    muts_per_trans_minmax: [0, 2],
  };

  const initializeReport = (
    tree: Node,
    home_geo: {
      location: string;
      division: string;
      country: string;
      region?: string;
    } = futureUserInput["home_geo"],
    min_muts_to_parent: number = futureUserInput["min_muts_to_parent"],
    muts_per_trans_minmax: number[] = futureUserInput["muts_per_trans_minmax"],
    event?: any
  ) => {
    // setSelectedSamples(
    //   event.target.result.split(",").map((n) => find_leaf_by_name(n, tree))
    // ); // For later - once we add the input box
    // setSelectedSamples(get_leaves(get_root(tree)).slice(-10)); // HELP - why doesn't this work?
    const selectedSamples = get_leaves(get_root(tree)).slice(-10); // HELP - how am I allowed to do this if I'm using useState?
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

    setIsFilePicked(true);
    fileReader.readAsText(event.target.files[0], "application/JSON");
    fileReader.onload = (event) => {
      if (event?.target?.result && typeof event.target.result === "string") {
        var tree: Node = ingestNextstrain(JSON.parse(event.target.result));
        setTree(tree);
        initializeReport(tree);
      }
    };
  };

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
      {!isFilePicked ? (
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
