import { useSelector, useDispatch } from "react-redux";
import { getNodeAttr, traverse_preorder } from "../../../utils/treeMethods";
import { Node } from "../../../d";
import { useEffect, useState } from "react";
import { MenuItem, Select, FormControl, FormHelperText } from "@mui/material";
import { formatMrcaSliderOptionValue } from "./cladeSlider";

type CladeSelectorProps = {};

export const CladeSelector = (props?: CladeSelectorProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const allMrcas = traverse_preorder(state.tree).filter(
    (n: Node) => n.children.length >= 2
  );

  // SELECTOR DATA UTILS
  let sliderValueMrcasMap: { [key: string]: Node[] } = {};
  allMrcas.forEach((mrca: Node) => {
    const val: string = formatMrcaSliderOptionValue(
      mrca,
      state.cladeSliderField
    ).toString();
    if (Object.keys(sliderValueMrcasMap).includes(val)) {
      sliderValueMrcasMap[val].push(mrca);
    } else {
      sliderValueMrcasMap[val] = [mrca];
    }
  });

  const formatSelectorMrcaLabel = (mrca: Node) => {
    const tipCount = getNodeAttr(mrca, "tipCount");
    const niceName = mrca.name.replace("NODE_", "Clade ");
    return niceName;
  };

  const formatSelectorOptions = () => {
    if (!state.mrcaOptions || !state.mrca || !state.cladeSliderValue) {
      return [];
    } else {
      console.assert(
        Object.keys(sliderValueMrcasMap).includes(
          state.cladeSliderValue.toString()
        ),
        "Invalid slider value reached -- no mrcas match value!?"
      );

      const mrcaOptionsNames = state.mrcaOptions.map((n: Node) => n.name);

      const mrcasMatchingSliderVal =
        sliderValueMrcasMap[state.cladeSliderValue.toString()];

      const mrcasMatchingSliderValAndFilters = mrcasMatchingSliderVal.filter(
        (thisMrca: Node) => mrcaOptionsNames.includes(thisMrca.name)
      );

      return mrcasMatchingSliderValAndFilters.map((thisMrca: Node) => {
        return {
          value: thisMrca.name,
          label: formatSelectorMrcaLabel(thisMrca),
        };
      });
    }
  };

  // SELECTOR STATE
  // Primary data structure for the selector; useEffect to update options whenever the slider is moved or clades are filtered
  const mrcaNameToTipCount: { [key: string]: number } = {};
  if (state.tree) {
    traverse_preorder(state.tree).forEach((n: Node) => {
      if (n.children) {
        mrcaNameToTipCount[n.name] = getNodeAttr(n, "tipCount");
      }
    });
  }

  const [formattedSelectorOptions, setFormattedSelectorOptions] = useState<any>(
    formatSelectorOptions()
  );

  useEffect(() => {
    if (state.tree && state.mrcaOptions && state.cladeSliderValue) {
      const newFormattedSelectorOptions = formatSelectorOptions();

      setFormattedSelectorOptions(newFormattedSelectorOptions);
      dispatch({
        type: "mrca selected",
        data: newFormattedSelectorOptions[0].value,
      });
    }
  }, [state.cladeSliderValue]);

  return (
    <FormControl margin="dense" size="small">
      <Select
        variant="standard"
        value={state.mrca ? state.mrca.name : "No clade selected"}
        defaultValue={
          formattedSelectorOptions.length >= 1
            ? formattedSelectorOptions[0].label
            : "Invalid"
        }
        onChange={(event) =>
          dispatch({ type: "mrca selected", data: event.target.value })
        }
        size="small"
        disabled={formattedSelectorOptions.length < 2}
        //@ts-ignore
        IconComponent={formattedSelectorOptions.length < 2 ? null : undefined}
        sx={{ fontSize: 12 }}
        disableUnderline={true}
      >
        {formattedSelectorOptions.map((o: any) => (
          <MenuItem value={o.value}>{o.label}</MenuItem>
        ))}
      </Select>
      <FormHelperText
        sx={{ fontSize: 10, position: "relative", top: -10, left: -7 }}
      >
        {state.mrca && mrcaNameToTipCount[state.mrca.name]
          ? `${mrcaNameToTipCount[
              state.mrca.name
            ].toLocaleString()} total samples`
          : ""}
      </FormHelperText>
    </FormControl>
  );
};

export default CladeSelector;
