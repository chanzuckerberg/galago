import { getNodeAttr, get_leaves, traverse_preorder } from "./treeMethods";
import { Node, metadataFieldSummary, papaParseMetadataEntry } from "../d";

export const nullishMetadataValues = [
  undefined,
  null,
  NaN,
  "",
  "NA",
  "N/A",
  "na",
  "n/a",
  "none",
  "None",
  "NONE",
  "-",
  "--",
  "?",
];
export const acceptedMetadataTypes = [
  "[object String]",
  "[object Number]",
  "[object Date]",
  "[object Boolean]",
];

export const inspectMetadataField = (
  metadataEntries: Array<Node | papaParseMetadataEntry>,
  field: string,
  type: "nodes" | "csv"
) => {
  /* 
    Infer the data type for a given metadata field in papaparse results. 
    Return a summary with the data type and the N of unique values (categorical data) or the range (date or numeric data). 

    If a field has mixed data types, or some type that is not date, numeric or string, return undefined
    */
  let seenValueType = "";
  let seenUniqueValues: string[] = [];
  let seenMinValue: number | object = NaN;
  let seenMaxValue: number | object = NaN;

  let nextstrainAncestralTraitsComputed: boolean | undefined = undefined; // make a note if ancestral states have been computed and byy which method
  let matutilsAncestralTraitsComputed: boolean | undefined = undefined;

  metadataEntries.forEach((entry: any) => {
    let thisValue: any = undefined;
    if (type === "nodes") {
      // looking at a list of nodes
      thisValue = getNodeAttr(entry, field);
      nextstrainAncestralTraitsComputed = // all nodes thus far have returned a value for "confidence"
        getNodeAttr(entry, field, "confidence") &&
        [undefined, true].includes(nextstrainAncestralTraitsComputed);
      matutilsAncestralTraitsComputed = // all nodes thus far have returned a value for "matutils_confidence"
        getNodeAttr(entry, field, "matutils_confidence") &&
        [undefined, true].includes(matutilsAncestralTraitsComputed);
    } else {
      // looking at a list of papaparse metadata entries; these don't have ancestral state information
      thisValue = Object.keys(entry).includes(field) ? entry[field] : undefined;
    }

    // note: for now, ignore missing values. may want to revisit this decision later.
    if (!nullishMetadataValues.includes(thisValue)) {
      // use this to differentiate dates from other objects
      let thisValueType = Object.prototype.toString.call(thisValue);

      // check for invalid or mixed data types
      if (!seenValueType) {
        seenValueType = thisValueType;
      }
      if (
        seenValueType !== thisValueType || // column has multiple data types - chuck it
        !acceptedMetadataTypes.includes(thisValueType) // this is not a number, date or string - chuck it
      ) {
        console.warn(
          "Field has mixed and/or unaccepted data types:",
          field,
          thisValueType,
          thisValue,
          seenValueType
        );
        return undefined;
      }

      // record unique values for categorical data
      if (["[object String]", "[object Boolean]"].includes(thisValueType)) {
        if (!seenUniqueValues.includes(thisValue)) {
          seenUniqueValues.push(thisValue);
        }
      } else {
        // record range for continuous data
        if (!seenMinValue || thisValue < seenMinValue) {
          seenMinValue = thisValue;
        }
        if (!seenMaxValue || thisValue > seenMaxValue) {
          seenMaxValue = thisValue;
        }
      }
    }
  });

  let summary: metadataFieldSummary = {
    // @ts-ignore - guaranteed to be one of the accepted values above
    type: seenValueType,
    nextstrainAncestralTraitsComputed: nextstrainAncestralTraitsComputed
      ? true
      : false,
    matutilsAncestralTraitsComputed: matutilsAncestralTraitsComputed
      ? true
      : false,
  };
  if (
    seenValueType === "[object String]" ||
    seenValueType === "[object Boolean]"
  ) {
    summary["dataType"] = "categorical";
    summary["uniqueValues"] = seenUniqueValues;
  } else if (seenValueType === "[object Boolean]") {
    summary["dataType"] = "categorical";
    summary["uniqueValues"] = seenUniqueValues;
  } else {
    summary["dataType"] = "continuous";
    summary["min"] = seenMinValue;
    summary["max"] = seenMaxValue;
  }
  return summary;
};

const replaceMissingValues = (
  /* Replace all null-ish values in a single metadata row with a uniform missing data representation per data type */
  metadataEntry: papaParseMetadataEntry,
  metadataCensus: { [key: string]: metadataFieldSummary },
  fields?: string[]
) => {
  const defaultBackfillValues: { [key: string]: any } = {
    "[object String]": "unknown",
    "[object Number]": NaN,
    "[object Date]": undefined,
    "[object Boolean]": undefined,
  };

  fields ??= Object.keys(metadataCensus);

  const newMetadataEntry: { [key: string]: any } = {};
  fields.forEach((field: string) => {
    // note: silently drops any fields that didn't make it into the census
    const backfillValue = defaultBackfillValues[metadataCensus[field]["type"]];
    if (
      !Object.keys(metadataEntry).includes(field) ||
      nullishMetadataValues.includes(metadataEntry[field])
    ) {
      newMetadataEntry[field] = backfillValue;
    } else {
      newMetadataEntry[field] = metadataEntry[field];
    }
  });
  return newMetadataEntry;
};

export const ingestCSVMetadata = (metadata: papaParseMetadataEntry[]) => {
  /* Catalog the kind of data we received, chuck invalid fields, and tidy up missing values */
  const fields = Object.keys(metadata[0]);
  let metadataCensus: { [keys: string]: metadataFieldSummary } = {};

  fields.forEach((field: string) => {
    const summary = inspectMetadataField(metadata, field, "csv");
    if (summary) {
      metadataCensus[field] = summary;
    }
  });

  const tidyMetadata = metadata.map((entry: { [key: string]: any }) =>
    replaceMissingValues(entry, metadataCensus)
  );

  return { metadataCensus: metadataCensus, tidyMetadata: tidyMetadata };
};

export const zipMetadataToTree = (
  tree: Node,
  tidyMetadata: papaParseMetadataEntry[],
  fieldToMatch: string
) => {
  let reorganizedMetadata: { [key: string]: any } = {};

  // reorient metadata to organize it by the field we're matching on <-> node names
  tidyMetadata.forEach((entry: papaParseMetadataEntry) => {
    const matchValue = entry[fieldToMatch];
    delete entry[fieldToMatch];
    reorganizedMetadata[matchValue] = entry;
  });

  const leaves = get_leaves(tree);
  let leavesWithData = 0;
  leaves.forEach((leaf: Node) => {
    if (Object.keys(reorganizedMetadata).includes(leaf.name)) {
      leavesWithData += 1;
      leaf.node_attrs = {
        ...leaf.node_attrs,
        ...reorganizedMetadata[leaf.name], // note: overwrites with new values from csv
      };
    }
  });
  // console.log(
  //   "matched metadata for ",
  //   leavesWithData,
  //   " out of ",
  //   leaves.length,
  //   " leaves"
  // );
  return tree;
};

export const treeMetadataCensus = (tree: Node) => {
  let allNodes = traverse_preorder(tree);

  let metadataFields = new Set();
  allNodes.forEach((n: Node) => {
    Object.keys(n.node_attrs).forEach((k: string) => metadataFields.add(k));
  });

  let metadataCensus: { [key: string]: any } = {};
  metadataFields.forEach(
    //@ts-ignore
    (field: string) =>
      (metadataCensus[field] = inspectMetadataField(allNodes, field, "nodes"))
  );
  return metadataCensus;
};
