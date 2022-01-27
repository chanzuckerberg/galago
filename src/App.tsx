import ClusterDefinition from "./components/cluster_definition";
import ClusterUniqueness from "./components/cluster_uniqueness";
import TMRCA from "./components/tmrca";
import PhyloUncertainty from "./components/phylo_uncertainty";
// import MinIntroductions from "./components/PAUSED_min_introductions";
import OnwardTransmission from "./components/onward_transmission";
// import DatasetGeoCompletion from "./components/dataset_geo_completion";

//@ts-ignore
import { nextstrain_json } from "../stub_data/ncov_humboldt";
//@ts-ignore
import { gisaid_counts_file } from "../stub_data/gisaid_counts";
import { ingest_nextstrain } from "./utils/nextstrainAdapter";
import {
  describe_clade,
  Node,
  CladeDescription,
  GISAIDRecord,
} from "./d";
import { random_sample } from "./utils/misc";
import { get_root, get_leaves } from "./utils/treeMethods";
import SamplingBias from "./components/sampling_bias";
import Assumptions from "./components/assumptions";

function App() {
  //@ts-ignore
  var tree: Node = ingest_nextstrain(nextstrain_json);
  //@ts-ignore
  var gisaid_census: Array<GISAIDRecord> = gisaid_counts_file.data;

  var all_samples: Array<Node> = get_leaves(get_root(tree));
  var selected_samples: Array<Node> = all_samples.slice(-10);

  var clade_description: CladeDescription = describe_clade(
    selected_samples,
    {
      location: "Humboldt",
      division: "California",
      country: "USA",
      region: "North America",
    },
    [0, 2],
    1
  );

  return (
    <div>
      <h1>Galago</h1>
      <h3>A little tree explorer for public health</h3>
      <SamplingBias
        gisaid_census={gisaid_census}
        all_samples={all_samples}
        selected_samples={selected_samples}
      />
      {/* <ClusterDefinition data={clade_description} />
      <ClusterUniqueness data={clade_description} />
      <TMRCA data={clade_description} />
      <OnwardTransmission data={clade_description} />
      <PhyloUncertainty data={all_samples} />
      <Assumptions data={clade_description} /> */}
      {/* <MinIntroductions data={clade_description} /> */}
    </div>
  );
}

export default App;
