import { Node } from "src/d";

export const stringToNames = (
  inputString: string,
  namesToNodes: { [key: string]: Node }
) => {
  const allSampleNames = Object.keys(namesToNodes);

  const splitStrings = inputString
    .split(/[\s\t,]+/)
    .map((splitString: string) =>
      splitString
        .replace(/[\s\t,]+/, "")
        .trim()
        .toLowerCase()
    );

  const validInputNames = splitStrings.filter((name: string) =>
    allSampleNames.includes(name)
  );

  const cruft = splitStrings.filter(
    (str: string) => !allSampleNames.includes(str)
  );

  return { validInputNames, cruft };
};
