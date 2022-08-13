import { useSelector, useDispatch } from "react-redux";
import Slider from "@mui/material/Slider";
import { getNodeAttr, traverse_preorder } from "../../../utils/treeMethods";
import { Node } from "../../../d";
import { useEffect, useState } from "react";
import { dateObjectToNumeric } from "../../../utils/dates";
import { FormControl, FormHelperText } from "@mui/material";
import { useWindowSize } from "@react-hook/window-size";
import { timeFormat } from "d3-time-format";
import { extent } from "d3-array";
import Theme from "../../../theme";

type CladeSliderProps = {};

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

export const CladeSlider = (props: CladeSliderProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);

  //@ts-ignore
  const dispatch = useDispatch();

  const wholeTreeMinMax = extent(traverse_preorder(state.tree), (n) =>
    getNodeAttr(n, state.cladeSliderField)
  );

  // SLIDER DATA UTILS
  // const formatMrcaSliderOptionLabel = (mrca: Node) => {
  //   let rawValue = getNodeAttr(mrca, state.cladeSliderField);
  //   if (state.cladeSliderField === "num_date") {
  //     return timeFormat("%Y-%m-%d")(rawValue);
  //   } else {
  //     return rawValue.toString();
  //   }
  // };

  const formatMrcaSliderOptions = (mrcaOptions: Node[]) => {
    const sortFn = (a: Node, b: Node) => {
      let aVal = getNodeAttr(a, state.cladeSliderField);
      let bVal = getNodeAttr(b, state.cladeSliderField);

      if (state.cladeSliderField === "num_date") {
        aVal = dateObjectToNumeric(aVal);
        bVal = dateObjectToNumeric(bVal);
      }
      return aVal - bVal;
    };

    mrcaOptions.sort(sortFn);

    let formattedOptions = [];
    for (let i = 0; i < mrcaOptions.length; i++) {
      // retrieve slider value for given node, including converting from Date to number as needed
      const thisMrca = mrcaOptions[i];
      const option: any = {
        value: formatMrcaSliderOptionValue(thisMrca, state.cladeSliderField),
      };
      formattedOptions.push(option);
    }
    return formattedOptions;
  };

  // SLIDER STATE
  // Primary data structure for the slider; useEffect updates this whenever the tree or the mrcaOptions (i.e., filters on which mrcas to consider) change
  const [formattedSliderOptions, setFormattedSliderOptions] = useState<
    Array<{ value: number }>
  >(formatMrcaSliderOptions(state.mrcaOptions));

  useEffect(() => {
    if (state.tree && state.mrcaOptions) {
      setFormattedSliderOptions(formatMrcaSliderOptions(state.mrcaOptions));
    }
  }, [state.tree, state.mrcaOptions]);

  return (
    <FormControl fullWidth={true} margin="dense">
      <Slider
        //@ts-ignore
        sx={{
          // width: sectionWidth - 100,
          "& .MuiSlider-thumb": {
            opacity: 0.7,
          },
          "& .MuiSlider-rail": {
            color: "gray",
          },
          "& .MuiSlider-mark": {
            height: 8,
            "&.MuiSlider-markActive": {
              opacity: 1.0,
              visible: true,
              height: 10,
            },
          },
        }}
        aria-label="Use slider to select a hierarchical cluster (clade)"
        step={null}
        valueLabelDisplay="auto"
        marks={formattedSliderOptions}
        track={false}
        value={state.cladeSliderValue}
        defaultValue={
          state.mrca
            ? formatMrcaSliderOptionValue(state.mrca, state.cladeSliderField)
            : formatMrcaSliderOptionValue(state.tree, state.cladeSliderField)
        }
        onChange={(event: Event, newValue: any) =>
          dispatch({ type: "clade slider value changed", data: newValue })
        }
        min={
          state.cladeSliderField === "num_date"
            ? dateObjectToNumeric(wholeTreeMinMax[0])
            : wholeTreeMinMax[0]
        }
        max={
          state.cladeSliderField === "num_date"
            ? dateObjectToNumeric(wholeTreeMinMax[1])
            : wholeTreeMinMax[1]
        }
        size="medium"
      />
      <FormHelperText style={{ position: "absolute", left: -20, top: 20 }}>
        {state.cladeSliderField === "num_date"
          ? timeFormat("%Y-%m-%d")(wholeTreeMinMax[0])
          : wholeTreeMinMax[0].toString()}
      </FormHelperText>
      <FormHelperText style={{ position: "absolute", right: -20, top: 20 }}>
        {state.cladeSliderField === "num_date"
          ? timeFormat("%Y-%m-%d")(wholeTreeMinMax[1])
          : wholeTreeMinMax[1].toString()}{" "}
      </FormHelperText>
      <FormHelperText
        style={{ margin: "auto", position: "relative", top: -45 }}
      >
        {state.cladeSliderField === "num_date"
          ? "Date of cluster's primary case"
          : "Mutations between root & cluster's primary case"}
      </FormHelperText>
    </FormControl>
  );
};

export default CladeSlider;
