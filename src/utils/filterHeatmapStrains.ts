import { MutDistances } from "../d";

export const filterToIncludedSamples = (
  inputData: Array<MutDistances>,
  strainsToKeep: string[]
) => {
  const filteredData = [
    ...inputData.filter((d: MutDistances) => strainsToKeep.includes(d.strain)),
  ];

  const filterDistances = (d: MutDistances) => {
    return {
      strain: d.strain,
      distances: d.distances.filter((record) =>
        strainsToKeep.includes(record.strain)
      ),
    };
  };
  return filteredData.map(filterDistances);
};

export const getDefaultSampleSet = (
  rawData: any,
  samplesOfInterestNames: string[],
  maxSamples: number = 50
) => {
  // console.log("getting default sample set from raw data:", rawData);
  // NB: the entries in rawData are already ordered by proximity to the MRCA of the selected clade because of how they're calculated -- i.e., we can just take them in order until full
  const dataSamplesOfInterest = rawData.filter((datum: any) =>
    samplesOfInterestNames.includes(datum.strain)
  );
  const dataOtherSamples = rawData.filter(
    (datum: any) => !samplesOfInterestNames.includes(datum.strain)
  );

  // first add as many samples of interest as we can fit
  let includedSampleNames: Array<string> = dataSamplesOfInterest
    .slice(0, 50)
    .map((d: any) => d.strain);
  // console.log("found N samples of interest", includedSampleNames);
  // then fill in with other samples, again in order of increasing distance from the MRCA
  const remainingSpots = maxSamples - includedSampleNames.length;
  includedSampleNames = includedSampleNames.concat(
    dataOtherSamples.slice(0, remainingSpots).map((d: any) => d.strain)
  );

  return includedSampleNames;
};
