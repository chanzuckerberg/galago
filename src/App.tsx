import Narrative from "./components/narrative";
import insight_text from "./insight_text/insight_text";
import stub_data from "../stub_data/random_clade_humboldt";

function App() {
  return (
    <div>
      <h1>Galago</h1>
      <h3>A little tree explorer for public health</h3>
      <Narrative clade={stub_data} />
    </div>
  );
}

export default App;
