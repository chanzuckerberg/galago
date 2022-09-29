import { Node } from "../d";
import { getNodeAttr } from "./treeMethods";

export const filterSamples = (
  samples: Node[],
  caseDefFilters: { [key: string]: any },
  samplesOfInterestNames: string[]
) => {
  let matchingSamples: Node[] = samples;
  if (Object.keys(caseDefFilters).length === 0) {
    return [];
  }

  for (let i = 0; i < Object.entries(caseDefFilters).length; i++) {
    let [field, filter] = Object.entries(caseDefFilters)[i];

    //@ts-ignore
    if (filter["dataType"] === "categorical") {
      //@ts-ignore
      matchingSamples = matchingSamples.filter((n: Node) =>
        //@ts-ignore
        filter["acceptedValues"].includes(getNodeAttr(n, field))
      );
    } else {
      //@ts-ignore
      matchingSamples = matchingSamples.filter(
        (n: Node) =>
          //@ts-ignore
          getNodeAttr(n, field) <= filter["max"] &&
          getNodeAttr(n, field) >= filter["min"]
      );
    }
  }

  const newMatchingSamples = matchingSamples.filter(
    (n: Node) => !samplesOfInterestNames.includes(n.name)
  );

  return newMatchingSamples;
};

export const fieldIsValid = (fieldSummary: any) => {
  if (fieldSummary["dataType"] == "categorical") {
    return (
      fieldSummary["uniqueValues"].length <= 100 &&
      fieldSummary["uniqueValues"].length >= 1
    );
  } else {
    return (
      !isNaN(fieldSummary["min"]) && fieldSummary["min"] !== fieldSummary["max"]
    );
  }
};
