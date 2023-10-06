import { dateObjectToNumeric } from "./dates";
import { Node } from "../d";
import { getNodeAttr } from "./treeMethods";

export const formatMrcaSliderOptionValue = (
  thisMrca: Node,
  cladeSliderField: string
) => {
  //@ts-ignore
  let value = getNodeAttr(thisMrca, cladeSliderField);
  if (cladeSliderField === "num_date") {
    value = dateObjectToNumeric(value);
  }
  return value;
};

export const formatSelectorMrcaLabel = (mrcaName: string) => {
  if (!mrcaName) {
    return "";
  }
  const niceName = mrcaName.replace("NODE_", "Clade ");
  return niceName;
};
