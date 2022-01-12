import { CladeDescription } from "../d";

type CladeProps = {
  data: CladeDescription;
};

function Narrative(props: CladeProps) {
  const { data } = props;

  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "50em",
      }}
    >
      <h4>
        What is the smallest genomic cluster that contains all of your samples?
      </h4>
      <h2>
        {` 
        ${
          data.samples_monophyletic
            ? `Your ${data.n_samples} selected samples are all more closely related to each other than to anything else in this dataset.`
            : `Your ${data.n_samples} selected samples are also closely related to samples from ${data.cousin_locations}.`
        }`}
      </h2>
      <p>
        This means that the shortest plausible transmission chain connecting
        your selected samples to each other does not necessarily include any
        other samples from this dataset.
      </p>
      <p>
        {`These ${data.n_samples} samples are separated from each other by
        ${data.min_bn_sample_muts} - ${data.max_bn_sample_muts} mutations (or,
        on average, about ${data.min_bn_sample_muts * data.min_trans_per_mut} - 
        ${data.max_bn_sample_muts * data.max_trans_per_mut} transmission
        events).`}
      </p>
    </div>
  );
}

export default Narrative;
