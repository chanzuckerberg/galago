import { InsightText } from "../d";

const insight_text: InsightText = {
  cluster_diffusion_if_monophyly_true: {
    title:
      "What is the smallest genomic cluster that contains all of your samples?",
    subtitle:
      "Your {props.n_samples} selected samples are all more closely related to each other than to anything else in this dataset.",
    body: "<p>This means that the shortest plausible transmission chain connecting your selected samples to each other does not necessarily include any other samples from this dataset.</p><p>These {props.n_samples} samples are separated from each other by {props.min_bn_sample_muts} - {props.max_bn_sample_muts} mutations (or, on average, about {props.min_bn_sample_muts * props.min_trans_per_mut} - {props.max_bn_sample_muts * props.max_trans_per_mut} transmission events.</p>",
  },
  cluster_diffusion_if_monophyly_false: {
    title:
      "What is the smallest genomic cluster that contains all of your samples?",
    subtitle:
      "Your {props.n_samples} selected samples are also closely related to samples from {props.cousin_locations}.",
    body: "<p>This means that the shortest plausible transmission chain connecting your selected samples to each other also includes samples from {props.cousin_locations}.</p><p>Your {props.n_samples} selected samples are separated from each other by {props.min_bn_sample_muts} - {props.max_bn_sample_muts} mutations (or, on average, about {props.min_bn_sample_muts * props.min_trans_per_mut} - {props.max_bn_sample_muts * props.max_trans_per_mut} transmission events.</p>",
  },
};

export default insight_text;
