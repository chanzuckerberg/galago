import { getFormControlLabelUtilityClasses } from "@mui/material";
import { Node, GISAIDRecord, HomeGeo } from "../d";
import { getNodeAttr } from "./treeMethods";

export type GeoLevels = "location" | "division" | "country";

const matchesGeography = (
  type: "gisaid" | "node",
  homeGeo: HomeGeo,
  geoLevel: string,
  gisaidRecord?: GISAIDRecord,
  node?: Node
) => {
  let location, division, country;

  // fetch data differently dependent on record type
  if (type === "gisaid" && gisaidRecord) {
    location = gisaidRecord.location;
    division = gisaidRecord.division;
    country = gisaidRecord.country;
  } else if (type === "node" && node) {
    location = getNodeAttr(node, "location");
    division = getNodeAttr(node, "division");
    country = getNodeAttr(node, "country");
  } else {
    console.warn("ERROR: malformed input to matchesGeography");
    return false;
  }

  // return boolean based on what level of geographic match we require / exclude
  switch (geoLevel) {
    case "location": {
      return (
        location === homeGeo.location &&
        division === homeGeo.division &&
        country === homeGeo.country
      );
    }
    case "division": {
      return (
        // other locations in state
        location !== homeGeo.location &&
        division === homeGeo.division &&
        country === homeGeo.country
      );
    }
    case "country": {
      return (
        // other states in country
        location !== homeGeo.location &&
        division !== homeGeo.division &&
        country === homeGeo.country
      );
    }
  }
};

const matchesDateRange = (
  type: "gisaid" | "node",
  minDate: Date,
  maxDate: Date,
  gisaidRecord?: GISAIDRecord,
  node?: Node
) => {
  let date: Date;

  if (type === "gisaid" && gisaidRecord) {
    date = new Date(Date.parse(`${gisaidRecord.year}-${gisaidRecord.month}`));
  } else if (type === "node" && node) {
    date = getNodeAttr(node, "num_date");
  } else {
    console.warn("ERROR: malformed input to matchesDateRange");
    return false;
  }

  return date >= minDate && date <= maxDate;
};

export const getCount = (
  type: "node" | "gisaid",
  geoLevel: GeoLevels,
  homeGeo: HomeGeo,
  minDate: Date,
  maxDate: Date,
  gisaidRecords?: GISAIDRecord[],
  nodes?: Node[]
) => {
  if (type === "gisaid" && gisaidRecords) {
    const filteredRecords = gisaidRecords.filter(
      (record: GISAIDRecord) =>
        matchesGeography("gisaid", homeGeo, geoLevel, record) &&
        matchesDateRange("gisaid", minDate, maxDate, record)
    );

    let total = 0;
    for (let i = 0; i < filteredRecords.length; i++) {
      total += filteredRecords[i]["count"];
    }
    return total;
  } else if (type === "node" && nodes) {
    const filteredNodes = nodes.filter(
      (node: Node) =>
        matchesGeography("node", homeGeo, geoLevel, undefined, node) &&
        matchesDateRange("node", minDate, maxDate, undefined, node)
    );
    return filteredNodes.length;
  } else {
    throw new Error("Malformed input to getCount");
  }
};
