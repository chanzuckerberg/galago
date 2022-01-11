import stub_data from "../stub_data/random_clade_humboldt";
import Narrative from "./components/narrative";
import insight_text from "./insight_text/insight_text";

function App() {
  return (
    <div>
      <h1>Galago</h1>
      <h3>A little tree explorer for public health</h3>
      <div>
        for (var insight_type in {insight_text}){" "}
        {
          <div>
            <Narrative
              key={"cluster_diffusion_if_monophyly_true"}
              data={stub_data}
            />
          </div>
        }
        );
      </div>
    </div>
  );
}

export default App;
