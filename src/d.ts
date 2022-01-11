export interface CladeDescription {
  samples: string[];
  mrca: string;
  tmrca: number;
  samples_monophyletic: boolean;
  cousins: string[];
  geo_monophyletic: boolean;
  min_transmissions_across_demes: any;
  muts_from_parent: number;
  n_onward_with_accumulated_muts: number;

  min_bn_sample_muts: number;
  max_bn_sample_muts: number;
  n_samples: number;
  cousin_locations: string[];
  min_trans_per_mut: number;
  max_trans_per_mut: number;
}

export interface InsightText {
  cluster_diffusion_if_monophyly_true: {
    title: String;
    subtitle: String;
    body: String;
  };
  cluster_diffusion_if_monophyly_false: {
    title: String;
    subtitle: String;
    body: String;
  };
}
