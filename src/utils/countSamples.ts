import { Node, GISAIDRecord, HomeGeo } from "../d";
import { getNodeAttr } from "./treeMethods";

export type GeoLevels = "location" | "division" | "country";

export const getNodeCounts = (
  nodes: Node[],
  geoLevel: GeoLevels,
  homeGeo: HomeGeo,
  minYear: number,
  minMonth: number,
  maxYear: number,
  maxMonth: number
) => {
  let filteredNodes: Node[] = [];

  if (geoLevel === "location") {
    // same county
    filteredNodes = nodes.filter((n: Node) => {
      const date = getNodeAttr(n, "num_date");
      const nodeMonth = date.getMonth();
      const nodeYear = date.getFullYear();
      return (
        getNodeAttr(n, "country") === homeGeo.country &&
        getNodeAttr(n, "division") === homeGeo.division &&
        getNodeAttr(n, "location") === homeGeo.location &&
        nodeYear <= maxYear &&
        nodeYear >= minYear &&
        nodeMonth <= maxMonth &&
        nodeMonth >= minMonth
      );
    });
  } else if (geoLevel === "division") {
    // same state diff county
    filteredNodes = nodes.filter((n: Node) => {
      const date = getNodeAttr(n, "num_date");
      const nodeMonth = date.getMonth() + 1; // indexing
      const nodeYear = date.getFullYear();

      return (
        getNodeAttr(n, "country") === homeGeo.country &&
        getNodeAttr(n, "division") === homeGeo.division &&
        getNodeAttr(n, "location") !== homeGeo.location &&
        nodeYear <= maxYear &&
        nodeYear >= minYear &&
        nodeMonth <= maxMonth &&
        nodeMonth >= minMonth
      );
    });
  } else if (geoLevel === "country") {
    // same county
    filteredNodes = nodes.filter((n: Node) => {
      const date = getNodeAttr(n, "num_date");
      const nodeMonth = date.getMonth();
      const nodeYear = date.getFullYear();

      return (
        getNodeAttr(n, "country") === homeGeo.country &&
        getNodeAttr(n, "division") !== homeGeo.division &&
        getNodeAttr(n, "location") !== homeGeo.location &&
        nodeYear <= maxYear &&
        nodeYear >= minYear &&
        nodeMonth <= maxMonth &&
        nodeMonth >= minMonth
      );
    });
  }
  return filteredNodes.length;
};

export const getGisaidCounts = (
  gisaidRecords: GISAIDRecord[],
  geoLevel: GeoLevels,
  homeGeo: HomeGeo,
  minYear: number,
  minMonth: number,
  maxYear: number,
  maxMonth: number
) => {
  let filteredGisaidRecords: GISAIDRecord[] = [];

  if (geoLevel === "location") {
    // same county
    filteredGisaidRecords = gisaidRecords.filter(
      (gr: GISAIDRecord) =>
        gr.country === homeGeo.country &&
        gr.division === homeGeo.division &&
        gr.location === homeGeo.location &&
        gr.year <= maxYear &&
        gr.year >= minYear &&
        gr.month - 1 <= maxMonth && // -1 for indexing (pandas dates are 1-idx; tsc dates are 0-idx)
        gr.month - 1 >= minMonth
    );
  } else if (geoLevel === "division") {
    // same state, different counties
    filteredGisaidRecords = gisaidRecords.filter(
      (gr: GISAIDRecord) =>
        gr.country === homeGeo.country &&
        gr.division === homeGeo.division &&
        gr.location !== homeGeo.location &&
        gr.year <= maxYear &&
        gr.year >= minYear &&
        gr.month - 1 <= maxMonth &&
        gr.month - 1 >= minMonth
    );
  } else if (geoLevel === "country") {
    // same country, different states
    filteredGisaidRecords = gisaidRecords.filter(
      (gr: GISAIDRecord) =>
        gr.country === homeGeo.country &&
        gr.division !== homeGeo.division &&
        gr.location !== homeGeo.location &&
        gr.year <= maxYear &&
        gr.year >= minYear &&
        gr.month - 1 <= maxMonth &&
        gr.month - 1 >= minMonth
    );
  }
  let total = 0;
  for (let i = 0; i < filteredGisaidRecords.length; i++) {
    total += filteredGisaidRecords[i]["count"];
  }
  return total;
};
