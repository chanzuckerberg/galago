export const pathogenParameters: {
  [key: string]: {
    name: string;
    genomeLength: number | "";
    subsPerSitePerYear: number | "";
    serialInterval: number | "";
  };
} = {
  none: {
    name: "",
    genomeLength: "",
    subsPerSitePerYear: "",
    serialInterval: "",
  },
  sarscov2: {
    name: "SARS-CoV-2",
    genomeLength: 29903,
    subsPerSitePerYear: 9.68e-4,
    serialInterval: 5.2,
  },
  monkeypox: {
    name: "Monkeypox",
    genomeLength: 197209,
    subsPerSitePerYear: 5.59e-5,
    serialInterval: 9.8,
  },
  tb: {
    name: "Tuberculosis",
    genomeLength: 4411532,
    subsPerSitePerYear: 1.33e-8,
    serialInterval: 529,
  },
  measles: {
    name: "Measles",
    genomeLength: 15894,
    subsPerSitePerYear: 4.97e-4,
    serialInterval: 12,
  },
  mumps: {
    name: "Mumps",
    genomeLength: 15384,
    subsPerSitePerYear: 4.35e-4,
    serialInterval: 18,
  },
  ebola: {
    name: "Ebola",
    genomeLength: 18959,
    subsPerSitePerYear: 1.05e-3,
    serialInterval: 13,
  },
  other: {
    name: "Other",
    genomeLength: "",
    subsPerSitePerYear: "",
    serialInterval: "",
  },
};

const factorial = (x: number) => {
  if (x < 0) {
    return NaN;
  } else if (x % 1 !== 0) {
    x = Math.round(x);
  }
  if (x === 0 || x === 1) return 1;
  for (var i = x - 1; i >= 1; i--) {
    x *= i;
  }
  return x;
};

const poissonPMF = (subsPerTransmission: number, nMutations: number) => {
  // estimate the probability of observing N mutations before a transmission, given the average number of substitutions per transmission
  const lambda = subsPerTransmission;
  const x = nMutations;

  const numerator = Math.E ** (-1 * lambda) * lambda ** x + 0.000001;
  const denominator = factorial(x);
  return numerator / denominator;
};

export const calcMutsPerTransmissionMax = (
  genomeLength: number,
  subsPerSitePerYear: number,
  serialInterval: number,
  threshold: 0.9
) => {
  const subsPerGenomePerYear = subsPerSitePerYear * genomeLength;
  const subsPerTransmission = (subsPerGenomePerYear / 365) * serialInterval;

  let nMutations = 0;
  let poissonCDF = poissonPMF(subsPerTransmission, 0);

  // until there is a [threshold]%+ cumulative probability of observing a transmission before reaching this N mutations, keep incrementing N mutations
  while (poissonCDF < threshold) {
    nMutations += 1;
    if (nMutations > 100) {
      //escape hatch
      return NaN;
    }
    const p = poissonPMF(subsPerTransmission, nMutations);
    poissonCDF += p;
  }

  return Math.max(nMutations, 1);
};
