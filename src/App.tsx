import ClusterDefinition from "./components/cluster_definition";
import ClusterUniqueness from "./components/cluster_uniqueness";
import TMRCA from "./components/tmrca";
import stub_data from "../stub_data/random_clade_humboldt";
import MinIntroductions from "./components/min_introductions";
import OnwardTransmission from "./components/onward_transmission";
import DatasetGeoCompletion from "./components/dataset_geo_completion";

function App() {
  return (
    <div>
      <h1>Galago</h1>
      <h3>A little tree explorer for public health</h3>
      <DatasetGeoCompletion data={stub_data.dataset_description} />
      <ClusterDefinition data={stub_data.clade_description} />
      <TMRCA data={stub_data.clade_description} />
      <ClusterUniqueness data={stub_data.clade_description} />
      <MinIntroductions data={stub_data.clade_description} />
      <OnwardTransmission data={stub_data.clade_description} />
    </div>
  );
}

export default App;
