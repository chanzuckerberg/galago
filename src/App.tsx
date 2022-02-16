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
  var tree: Node = ingest_nextstrain(nextstrain_json);
  //@ts-ignore

  const gisaid_raw_counts: GISAIDRawCounts = gisaid_counts_file;
  const gisaid_census: GISAIDRecord[] = gisaid_raw_counts.data;

  var all_samples: Array<Node> = get_leaves(get_root(tree));
  var selected_samples: Array<Node> = all_samples.slice(-10);

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
      <h1>
        Genomic Investigation of a Potential Outbreak
        <br />
        in {clade_description.home_geo.location}
      </h1>
      <h3>A Galago Report</h3>
      <SamplingBias
        gisaid_census={gisaid_census}
        all_samples={all_samples}
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
  );
}

export default App;
