export interface CladeDescription {
  selected_samples: string[];
  n_selected_samples: number;

  min_bn_sample_muts: number;
  max_bn_sample_muts: number;
  min_trans_per_mut: number;
  max_trans_per_mut: number;

  mrca: string;
  tmrca: number;
  samples_monophyletic: boolean;
  n_onward_with_accumulated_muts: number;
  n_total_samples: number;

  unselected_samples: string[];
  unselected_sample_locations: string[];

  muts_from_parent: number;
  n_cousins: number;
  cousin_locations: string[];
  min_cousin_date: string;
  max_cousin_date: string;

  geo_monophyletic: boolean;
  min_transmissions_across_demes: any;
}
