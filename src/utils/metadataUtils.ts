import { get_leaves } from "./treeMethods";
import { Node, metadataCensus, papaParseMetadataEntry } from "../d";

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
];

export const inspectMetadataField = (
  metadataEntries: papaParseMetadataEntry[],
  field: string
) => {
  /* 
    Infer the data type for a given metadata field in papaparse results. 
    Return an object with the data type and the N of unique values (categorical data) or the range (date or numeric data). 

    If a field has mixed data types, or some type that is not date, numeric or string, return false
    */
  let seenValueType = "";
  let seenUniqueValues: string[] = [];
  let seenMinValue: number | object = NaN;
  let seenMaxValue: number | object = NaN;

  metadataEntries.forEach((m: papaParseMetadataEntry) => {
    // field is present and not nullish
    if (
      Object.keys(m).includes(field) &&
      !nullishMetadataValues.includes(m[field])
    ) {
      let thisValue = m[field];
      let thisValueType = Object.prototype.toString.call(m[field]); // use this to differentiate dates from other objects

      // check for invalid types
      if (!seenValueType) {
        seenValueType = thisValueType;
      }

      if (
        (seenValueType && seenValueType !== thisValueType) || // column has multiple data types - chuck it
        !acceptedMetadataTypes.includes(thisValueType) // this is not a number, date or string - chuck it
      ) {
        console.log(
          "Field has mixed and/or unaccepted data types:",
          field,
          thisValueType,
          seenValueType
        );
        return false;
      }

      // record unique values for categorical data
      if (thisValueType === "[object String]") {
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

  let summary: { [key: string]: any } = { type: seenValueType };
  if (seenValueType === "[object String]") {
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
  metadataCensus: metadataCensus,
  fields?: string[]
) => {
  const defaultBackfillValues: { [key: string]: any } = {
    "[object String]": "unknown",
    "[object Number]": NaN,
    "[object Date]": NaN,
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

export const ingestMetadata = (metadata: papaParseMetadataEntry[]) => {
  /* Catalog the kind of data we received, chuck invalid fields, and tidy up missing values */
  const fields = Object.keys(metadata[0]);
  let metadataCensus: { [keys: string]: any } = {};

  fields.forEach((field: string) => {
    const summary = inspectMetadataField(metadata, field);
    if (summary) {
      metadataCensus[field] = summary;
    }
  });

  console.log("metadatacensus", metadataCensus);
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
  console.log(
    "matched metadata for ",
    leavesWithData,
    " out of ",
    leaves.length,
    " leaves"
  );
  return tree;
};
