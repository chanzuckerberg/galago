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
import Assumptions from "./components/assumptions.mdx";
import CladeDefinition from "./components/CladeDefinition.mdx";

function App() {
  //@ts-ignore

  const gisaid_raw_counts: GISAIDRawCounts = gisaid_counts_file;
  const gisaid_census: GISAIDRecord[] = gisaid_raw_counts.data;

  var clade_description: CladeDescription = describe_clade(
    selected_samples,
    {
      location: "Alameda County",
      division: "California",
      country: "USA",
      region: "North America",
    },
    [0, 2],
    1
  );

  const [tree, setTree] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event: any) => {
    const fileReader = new FileReader();

    setIsFilePicked(true);

    fileReader.readAsText(event.target.files[0], "application/JSON");

    fileReader.onload = (event) => {
      if (event && event.target) {
        //@ts-ignore
        var tree: Node = ingest_nextstrain(event.target.result);
        setTree(tree);
      }
    };
  };

  console.log("selected file", tree);

  if (tree) {
    var all_samples: Array<Node> = get_leaves(get_root(tree));
    var selected_samples: Array<Node> = all_samples.slice(-10);
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
      <h1>Alameda County Report</h1>
      <input type="file" name="file" onChange={changeHandler} />

      {isFilePicked && selectedFile ? (
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
      )}
      {isFilePicked && (
        <div>
          <SamplingBias
            gisaid_census={gisaid_census}
            all_samples={all_samples}
            clade_description={clade_description}
          />
          <CladeDefinition data={clade_description} />
          <CladeUniqueness data={clade_description} />
          <TMRCA data={clade_description} />
          <OnwardTransmission data={clade_description} />
          {/* <PhyloUncertainty data={all_samples} /> */}
          <Assumptions data={clade_description} />
          {/* <MinIntroductions data={clade_description} /> */}
        </div>
      )}
    </div>
  );
}

export default App;
