import ClusterDefinition from "./components/cluster_definition";
import ClusterUniqueness from "./components/cluster_uniqueness";
import TMRCA from "./components/tmrca";
import stub_data from "../stub_data/random_clade_humboldt";

function App() {
  return (
    <div>
      <h1>Galago</h1>
      <h3>A little tree explorer for public health</h3>
      <ClusterDefinition data={stub_data} />
      <TMRCA data={stub_data} />
      <ClusterUniqueness data={stub_data} />
    </div>
  );
}

export default App;
