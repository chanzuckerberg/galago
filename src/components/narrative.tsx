import { CladeDescription, InsightText } from "../d";
import insight_text from "../insight_text/insight_text";

type NarrativeProps = {
  key: string;
  data: CladeDescription;
};

function Narrative(props: NarrativeProps) {
  const { key } = props.key;
  const { data } = props.data;
  const { insight } = insight_text["cluster_diffusion_if_monophyly_true"];

  return (
    <div>
      <h3>insight.title</h3>
      <h4>insight.subtitle</h4>
      {/* <p>insight.body</p> */}
    </div>
  );
}

export default Narrative;
