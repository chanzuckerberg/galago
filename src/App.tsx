import React, { useState } from "react";

import { Helmet } from "react-helmet";
import CladeUniqueness from "./components/cladeUniqueness";
import TMRCA from "./components/tmrca";
import PhyloUncertainty from "./components/phylo_uncertainty";
// import MinIntroductions from "./components/PAUSED_min_introductions";
import OnwardTransmission from "./components/onwardTransmission";
// import DatasetGeoCompletion from "./components/dataset_geo_completion";
//@ts-ignore -- we're intentionally not typing the tree json for now
import { nextstrain_json } from "../stub_data/demo_tree";
import { gisaid_counts_file } from "../stub_data/gisaid_counts";
import { ingest_nextstrain } from "./utils/nextstrainAdapter";
import { Node, CladeDescription, GISAIDRecord, GISAIDRawCounts } from "./d";
import { describe_clade } from "./utils/describeClade";
import { get_root, get_leaves } from "./utils/treeMethods";
import SamplingBias from "./components/sampleDistribTable";
import Assumptions from "./components/assumptions";
import CladeDefinition from "./components/cladeDefinition";

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
    } = futureUserInput["home_geo"],
    min_muts_to_parent: number = futureUserInput["min_muts_to_parent"],
    muts_per_trans_minmax: number[] = futureUserInput["muts_per_trans_minmax"],
    event?: any
  ) => {
    // setSelectedSamples(event.target.result.split(",")); // For later - once we add the input box
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
      if (event && event.target) {
        var tree: Node = ingest_nextstrain(JSON.parse(event.target.result));
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
      <input type="file" name="file" onChange={handleTreeUpload} />
      {/* {isFilePicked && selectedFile ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{" "}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )} */}
      {clade_description && tree && (
        <div>
          <h1>
            Genomic Investigation of a Potential Outbreak
            <br />
            in {clade_description.home_geo.location}
          </h1>
          <SamplingBias
            gisaid_census={gisaid_census}
            all_samples={get_leaves(get_root(tree))}
            clade_description={clade_description}
          />
          <CladeDefinition clade_description={clade_description} />
          <CladeUniqueness clade_description={clade_description} />
          <TMRCA clade_description={clade_description} />
          <OnwardTransmission clade_description={clade_description} />
          {/* <PhyloUncertainty clade_description={all_samples} /> */}
          <Assumptions clade_description={clade_description} />
          {/* <MinIntroductions clade_description={clade_description} /> */}
        </div>
      )}
      ;
    </div>
  );
}

export default App;
