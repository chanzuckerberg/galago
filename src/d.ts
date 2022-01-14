export interface Sample {
  name: string;
  location: string;
  division: string;
  country: string;
  region: string;
  collection_date: string;
  muts_from_mrca: number;
  metadata: object;
}

export interface Introduction {
  source_loc: string;
  date_min: string;
  date_max: string;
  n_samples: string;
}

export interface CladeDescription {
  selected_samples: Sample[];
  unselected_samples_in_cluster: Sample[];

  muts_bn_selected: number[];
  min_trans_per_mut: number;
  max_trans_per_mut: number;

  // TODO: figure out how to use dates
  mrca: Sample;

  muts_from_parent: number;
  cousins: Sample[];

  home_geo: {
    location: string;
    division: string;
    country: string;
    region: string;
  };

  transmissions_across_demes: {
    location: Introduction[];
    division: Introduction[];
    country: Introduction[];
    region: Introduction[];
  };
}

export interface DatasetDescription {
  all_samples: Sample[];
}
