import ClusterDefinition from "./components/cluster_definition";
import ClusterUniqueness from "./components/cluster_uniqueness";
import TMRCA from "./components/tmrca";
import PhyloUncertainty from "./components/phylo_uncertainty";
// import MinIntroductions from "./components/PAUSED_min_introductions";
import OnwardTransmission from "./components/onward_transmission";
// import DatasetGeoCompletion from "./components/dataset_geo_completion";

import { nextstrain_json } from "../stub_data/ncov_humboldt";
import { ingest_nextstrain } from "./utils/nextstrainAdapter";
import { describe_clade, Node, CladeDescription } from "./d";
import { random_sample } from "./utils/misc";
import { get_root, get_leaves } from "./utils/treeMethods";
import SamplingBias from "./components/sampling-uncertainty";

function App() {
  var tree: Node = ingest_nextstrain(nextstrain_json);

  var all_samples: Array<Node> = get_leaves(get_root(tree));
  // var dataset: Object = Object.fromEntries(all_samples.map((x) => [x.name, x]));

  // var selected_samples: Array<Node> = random_sample(10, all_samples);
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
      <SamplingBias data={all_samples} />
      <ClusterDefinition data={clade_description} />
      <ClusterUniqueness data={clade_description} />
      <TMRCA data={clade_description} />
      <OnwardTransmission data={clade_description} />
      <PhyloUncertainty data={all_samples} />
      {/* <MinIntroductions data={clade_description} /> */}
    </div>
  );
}

export default App;
