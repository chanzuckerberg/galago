export interface Introduction {
  source_loc: string;
  date_min: string;
  date_max: string;
  n_samples: string;
}

export interface CladeDescription {
  selected_samples: Node[];
  unselected_samples_in_cluster: Node[];

  muts_bn_selected_minmax: number[];
  muts_per_trans_minmax: number[];

  // TODO: figure out how to use dates
  mrca: Node;

  muts_from_parent: number;
  cousins: Node[];

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
  all_samples: Node[];
}
