import { useSelector, useDispatch } from "react-redux";
import { getNodeAttr, traverse_preorder } from "../../../utils/treeMethods";
import { Node } from "../../../d";
import { useEffect, useState } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import { dateObjectToNumeric } from "src/utils/dates";
import { formatSelectorMrcaLabel } from "src/utils/formatValues";

type CladeCaptionProps = {};

export const CladeCaption = (props?: CladeCaptionProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const mrca = state.mrca;

  if (!mrca) return null;
  const mrcaName =
    mrca && mrca.name ? formatSelectorMrcaLabel(mrca.name) : "Root";
  const nSamplesOfInterestClade =
    state.cladeDescription.selected_samples.length;
  const nSamplesOfInterestTotal = state.samplesOfInterestNames.length;
  const nSamplesClade = mrca.node_attrs["tipCount"];
  const nSamplesTotal = state.tree.node_attrs["tipCount"];

  return (
    <div style={{ width: "225px" }}>
      <h5 style={{ marginBottom: 3 }}>{mrcaName}</h5>
      <FormHelperText>
        {`${nSamplesOfInterestClade} / ${nSamplesOfInterestTotal} samples of interest`}
        <br />
        {`${nSamplesClade} / ${nSamplesTotal} total samples`}
      </FormHelperText>
    </div>
  );
};

export default CladeCaption;
