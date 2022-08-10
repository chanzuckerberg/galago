import { useSelector, useDispatch } from "react-redux";
import Slider from "@mui/material/Slider";
import { getNodeAttr, traverse_preorder } from "../../../utils/treeMethods";
import { Node } from "../../../d";
import { useEffect, useState } from "react";
import { dateObjectToNumeric } from "../../../utils/dates";
import {
  MenuItem,
  Select,
  Button,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  Tooltip,
} from "@mui/material";
import React from "react";
import CladeFilterDrawer from "../../cladeFilterDrawer";
import { useWindowSize } from "@react-hook/window-size";
import { timeFormat } from "d3-time-format";
import { extent } from "d3-array";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { tooltipProps } from "../../formatters/sidenote";

type CladeSelectionVizControlsProps = {
  sectionWidth: number;
};

export const CladeSelectionVizControls = (
  props: CladeSelectionVizControlsProps
) => {
  const { sectionWidth } = props;
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [windowWidth, windowHeight] = useWindowSize();

  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const allMrcas = traverse_preorder(state.tree).filter(
    (n: Node) => n.children.length >= 2
  );

  const darkPurple = "#4f2379";
  const darkestGray = "rgba(80,80,80,1)";

  // SLIDER DATA UTILS
  const sliderField = state.haveInternalNodeDates ? "num_date" : "div";

  const formatMrcaSliderOptionValue = (mrca: Node) => {
    let value = getNodeAttr(mrca, sliderField);
    if (sliderField === "num_date") {
      value = dateObjectToNumeric(value);
    }
    return value;
  };

  // const formatMrcaSliderOptionLabel = (mrca: Node) => {
  //   let rawValue = getNodeAttr(mrca, sliderField);
  //   if (sliderField === "num_date") {
  //     return timeFormat("%Y-%m-%d")(rawValue);
  //   } else {
  //     return rawValue.toString();
  //   }
  // };

  const formatMrcaSliderOptions = (mrcas: Node[]) => {
    const sortFn = (a: Node, b: Node) => {
      let aVal = getNodeAttr(a, sliderField);
      let bVal = getNodeAttr(b, sliderField);

      if (sliderField === "num_date") {
        aVal = dateObjectToNumeric(aVal);
        bVal = dateObjectToNumeric(bVal);
      }
      return aVal - bVal;
    };

    mrcas.sort(sortFn);

    let formattedOptions = [];
    for (let i = 0; i < mrcas.length; i++) {
      // retrieve slider value for given node, including converting from Date to number as needed
      const mrca = mrcas[i];
      const option: any = { value: formatMrcaSliderOptionValue(mrca) };
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

  let [sliderValue, setSliderValue] = useState<number>(
    state.mrca
      ? formatMrcaSliderOptionValue(state.mrca)
      : formattedSliderOptions[0].value
  );

  // SELECTOR DATA UTILS
  let sliderValueMrcasMap: { [key: string]: Node[] } = {};
  allMrcas.forEach((mrca: Node) => {
    const val: string = formatMrcaSliderOptionValue(mrca).toString();
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
    // return tipCount ? `${niceName} (${tipCount} samples)` : niceName;
  };

  const formatSelectorOptions = () => {
    if (!sliderValue || !state.mrcaOptions) {
      return [];
    } else {
      const mrcaOptionsNames = state.mrcaOptions.map((n: Node) => n.name);
      const mrcasMatchingSliderVal =
        sliderValueMrcasMap[sliderValue.toString()];
      const mrcasMatchingSliderValAndFilters = mrcasMatchingSliderVal.filter(
        (mrca: Node) => mrcaOptionsNames.includes(mrca.name)
      );
      return mrcasMatchingSliderValAndFilters.map((mrca: Node) => {
        return {
          value: mrca.name,
          label: formatSelectorMrcaLabel(mrca),
        };
      });
    }
  };

  // SELECTOR STATE
  // Primary data structure for the selector; useEffect to update options whenever the slider is moved or clades are filtered
  const wholeTreeMinMax = extent(traverse_preorder(state.tree), (n) =>
    getNodeAttr(n, sliderField)
  );

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

  const getFilterButtonTooltipText = () => {
    if (state.samplesOfInterestNames.length || state.clusteringMethod) {
      return `Samples of interest: ${state.samplesOfInterestNames.length}  |
  Clustering: ${state.clusteringMethod ? state.clusteringMethod : "none"}
  ${
    state.clusteringMetadataField && state.clusterMethod
      ? "on " + state.metadataField
      : ""
  }`;
    } else {
      return "Locate samples of interest and filter clades";
    }
  };

  useEffect(() => {
    if (state.tree && state.mrcaOptions && sliderValue) {
      const newFormattedSelectorOptions = formatSelectorOptions();
      setFormattedSelectorOptions(newFormattedSelectorOptions);
      dispatch({
        type: "mrca selected",
        data: newFormattedSelectorOptions[0].value,
      });
    }
  }, [state.tree, state.mrcaOptions, sliderValue]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        position: "relative",
        width: sectionWidth,
        // paddingLeft: 25,
        // border: "1px solid purple",
      }}
    >
      <div
        id="clade selection slider"
        style={{ width: sectionWidth - 250, flexShrink: 0 }}
      >
        <FormControl fullWidth={true} margin="dense">
          <Slider
            //@ts-ignore
            sx={{
              // width: sectionWidth - 100,
              "& .MuiSlider-thumb": {
                color: darkPurple,
                opacity: 0.7,
              },
              "& .MuiSlider-rail": {
                color: "gray",
              },
              "& .MuiSlider-mark": {
                color: darkestGray,
                height: 8,
                "&.MuiSlider-markActive": {
                  opacity: 1.0,
                  visible: true,
                  height: 10,
                  color: darkestGray,
                },
              },
            }}
            aria-label="Use slider to select a hierarchical cluster (clade)"
            step={null}
            defaultValue={
              state.mrca
                ? formatMrcaSliderOptionValue(state.mrca)
                : formattedSliderOptions[0].value
            }
            valueLabelDisplay="auto"
            marks={formattedSliderOptions}
            track={false}
            value={sliderValue}
            onChange={(event: Event, newValue: any) => setSliderValue(newValue)}
            min={
              sliderField === "num_date"
                ? dateObjectToNumeric(wholeTreeMinMax[0])
                : wholeTreeMinMax[0]
            }
            max={
              sliderField === "num_date"
                ? dateObjectToNumeric(wholeTreeMinMax[1])
                : wholeTreeMinMax[1]
            }
            size="medium"
          />
          <FormHelperText style={{ position: "absolute", left: -20, top: 20 }}>
            {sliderField === "num_date"
              ? timeFormat("%Y-%m-%d")(wholeTreeMinMax[0])
              : wholeTreeMinMax[0].toString()}
          </FormHelperText>
          <FormHelperText style={{ position: "absolute", right: -20, top: 20 }}>
            {sliderField === "num_date"
              ? timeFormat("%Y-%m-%d")(wholeTreeMinMax[1])
              : wholeTreeMinMax[1].toString()}{" "}
          </FormHelperText>
          <FormHelperText
            style={{ margin: "auto", position: "relative", top: -45 }}
          >
            {sliderField === "num_date"
              ? "Date of cluster's primary case"
              : "Mutations between root & cluster's primary case"}
          </FormHelperText>
        </FormControl>
      </div>
      <div
        id="clade selection dropdown"
        style={{ width: 100, position: "relative", top: 7 }}
      >
        <FormControl margin="dense" size="small">
          <Select
            variant="standard"
            value={state.mrca.name}
            defaultValue={formattedSelectorOptions[0].label}
            onChange={(event) =>
              dispatch({ type: "mrca selected", data: event.target.value })
            }
            size="small"
            disabled={formattedSelectorOptions.length < 2}
            //@ts-ignore
            IconComponent={
              formattedSelectorOptions.length < 2 ? null : undefined
            }
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
      </div>
      <div
        id="clade filter drawer toggle button"
        style={{
          position: "relative",
          top: 11,
        }}
      >
        <Tooltip
          title={getFilterButtonTooltipText()}
          componentsProps={tooltipProps}
        >
          <Button
            onClick={() => setDrawerOpen(true)}
            size="small"
            sx={{
              fontSize: 10,
              color: darkPurple,
              borderColor: darkPurple,
              margin: 0,
              width: 50,
            }}
            variant="outlined"
          >
            Filter clusters
          </Button>
        </Tooltip>
        <Drawer
          anchor={"right"}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <div style={{ width: windowWidth * 0.4 }}>
            <CladeFilterDrawer />
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default CladeSelectionVizControls;
