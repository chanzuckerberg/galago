// import ClusterDefinition from "./components/cluster_definition";
// import ClusterUniqueness from "./components/cluster_uniqueness";
// import TMRCA from "./components/tmrca";
// import stub_data from "../stub_data/random_clade_humboldt_v2";
// import MinIntroductions from "./components/PAUSED_min_introductions";
// import OnwardTransmission from "./components/onward_transmission";
// import DatasetGeoCompletion from "./components/dataset_geo_completion";

import { nextstrain_json } from "../stub_data/ncov_humboldt";
import { ingest_nextstrain, NSNode } from "./utils/nextstrainAdapter";
import {
  DatasetDescription,
  describe_clade,
  describe_dataset,
  Node,
  CladeDescription,
} from "./d";

const random_sample = (n: number, array: Array<any>) => {
  if (n > array.length) {
    n = array.length;
  }

  let indices: Array<number> = []; // keep track of the indices previously selected

  for (let i = 0; i < n; i++) {
    // for each of n iterations...
    let index: number = NaN;
    while (!indices.includes(index)) {
      // choose a random index (redraw until you get one that has not been chosen before)
      index = Math.floor(Math.random() * array.length);
    }
    indices.push(index);
  }

  let selected: Node[] = [];
  for (let i = 0; i < n; i++) {
    selected.push(array[i]);
  }
  return selected;
};

function App() {
  var tree: Node = ingest_nextstrain(nextstrain_json);
  var dataset_description: DatasetDescription = describe_dataset(tree);
  var clade_description: CladeDescription = describe_clade(
    random_sample(10, Object.values(dataset_description)),
    {
      location: "Humboldt",
      division: "California",
      country: "USA",
      region: "North America",
    },
    [0, 3]
  );

  return (
    <div>
      <h1>Galago</h1>
      <h3>A little tree explorer for public health</h3>
      {/* <DatasetGeoCompletion data={stub_data.dataset_description} /> */}
      <ClusterDefinition data={clade_description} />
      {/*      <TMRCA data={stub_data.clade_description} />
      <ClusterUniqueness data={stub_data.clade_description} /> */}
      {/* <MinIntroductions data={stub_data.clade_description} /> */}
      {/* <OnwardTransmission data={stub_data.clade_description} /> */}
    </div>
  );
}

export default App;
