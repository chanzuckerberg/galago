export interface CladeDescription {
  selected_samples: string[];
  n_selected_samples: number;

  min_bn_sample_muts: number;
  max_bn_sample_muts: number;
  min_trans_per_mut: number;
  max_trans_per_mut: number;
  // TODO: figure out how to use dates
  mrca: string;
  mrca_matches: string[];
  tmrca: string;
  tmrca_min: string;
  tmrca_max: string;
  samples_monophyletic: boolean;
  onward_muts_threshold: number;
  n_onward_with_accumulated_muts: number;
  n_total_samples: number;

  unselected_samples: string[];
  unselected_sample_locations: string[];

  muts_from_parent: number;
  n_cousins: number;
  cousin_locations: string[];
  min_cousin_date: string;
  max_cousin_date: string;

  geo_attr: string;
  geo_attr_val: string;
  geo_monophyletic: boolean;
  min_transmissions_across_demes: number;
  introductions_source_locations: string[];
}

export interface DatasetDescription {
  n_samples: number;
  timepoints: string[];
  geo_home: {
    location: string;
    division: string;
    country: string;
    region: string;
  };
  dataset_census: {
    location_match: number[];
    division_match: number[];
    country_match: number[];
    region_match: number[];
    within_2_muts: number[];
    within_4_muts: number[];
    within_8_muts: number[];
  };
  available_census: {
    location_match: number[];
    division_match: number[];
    country_match: number[];
    region_match: number[];
    within_2_muts: number[];
    within_4_muts: number[];
    within_8_muts: number[];
  };
}
