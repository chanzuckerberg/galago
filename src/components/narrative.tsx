import { CladeDescription, InsightText } from "../d";
import insight_text from "../insight_text/insight_text";

type NarrativeProps = {
  clade: CladeDescription;
};

function Narrative(props: NarrativeProps) {
  const { clade } = props;

  // const { insight } = insight_text["cluster_diffusion_if_monophyly_true"];

  return (
    <div style={{ width: `40em` }}>
      <h2>Clade</h2>
      <h3>
        What is the smallest genomic cluster that contains all of your samples?
      </h3>
      <p>
        {`Your ${clade.n_samples} selected samples are all more closely related
        to each other than to anything else in this dataset.`}
      </p>
      <p>
        This means that the shortest plausible transmission chain connecting
        your selected samples to each other does not necessarily include any
        other samples from this dataset.
      </p>
      <p>
        {`These ${clade.n_samples} samples are separated from each other by
        ${clade.min_bn_sample_muts} - ${clade.max_bn_sample_muts} mutations (or,
        on average, about ${
          clade.min_bn_sample_muts * clade.min_trans_per_mut
        } - 
        ${clade.max_bn_sample_muts * clade.max_trans_per_mut} transmission
        events.`}
      </p>
      <p>
        {`TERNARY RAILROAD TRACKS 
        ${
          clade.n_samples > 20
            ? "CHOO CHOO"
            : ":( US doesn't have high speed rail"
        }`}
      </p>
    </div>
  );
}

export default Narrative;
