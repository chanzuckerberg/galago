import { CladeDescription } from "../d";

function ClusterDiffusion(props: CladeDescription) {
    return (
      <div>
        <h3>
          "What is the smallest genomic cluster that contains all of your
          samples?"
        </h3>
        <h4>
          "Your {props.n_samples} selected samples are all more closely related
          to each other than to anything else in this dataset."
        </h4>
        <p>
          This means that the shortest plausible transmission chain connecting
          your selected samples to each other does not necessarily include any
          other samples from this dataset.
        </p>

)

        <p>
          These {props.n_samples} samples are separated from each other by
          {props.min_bn_sample_muts} - {props.max_bn_sample_muts} mutations (or,
          on average, about {props.min_bn_sample_muts * props.min_trans_per_mut}
          - {props.max_bn_sample_muts * props.max_trans_per_mut} transmission
          events.
        </p>
        ",
      </div>
    );
  }
}

export default ClusterDiffusion;
