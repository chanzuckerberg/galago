import Narrative from "./components/cluster_definition";
import stub_data from "../stub_data/random_clade_humboldt";

function App() {
  return (
    <div>
      <h1>Galago</h1>
      <h3>A little tree explorer for public health</h3>
      <Narrative data={stub_data} />
    </div>
  );
}

export default App;
