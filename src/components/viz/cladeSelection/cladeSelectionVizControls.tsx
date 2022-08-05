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
} from "@mui/material";
import React from "react";
import CladeFilterDrawer from "../../cladeFilterDrawer";
import { useWindowSize } from "@react-hook/window-size";
import { timeFormat } from "d3-time-format";
import { extent } from "d3-array";

export const CladeSelectionVizControls = (props: { chartWidth: number }) => {
  const { chartWidth } = props;
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [windowWidth, windowHeight] = useWindowSize();

  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const allMrcas = traverse_preorder(state.tree).filter(
    (n: Node) => n.children.length >= 2
  );

  const toggleDrawer =
    (anchor: string, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setDrawerOpen(open);
      if (open) {
        dispatch({ type: "view plot toggled", data: "scatter" });
      }
    };

  // SLIDER DATA UTILS
  const sliderField =
    state.tree && allMrcas.every((n) => !isNaN(getNodeAttr(n, "num_date")))
      ? "num_date"
      : "div";

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

      // if (i === 0 || i === mrcas.length - 1) {
      //   option["label"] = formatMrcaSliderOptionLabel(mrca);
      // }
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
    formattedSliderOptions[0].value
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
    return tipCount ? `${niceName} (${tipCount} samples)` : niceName;
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

  const [formattedSelectorOptions, setFormattedSelectorOptions] = useState<any>(
    formatSelectorOptions()
  );

  useEffect(() => {
    if (state.tree && state.mrcaOptions && sliderValue) {
      const newFormattedSelectorOptions = formatSelectorOptions();
      setFormattedSelectorOptions(newFormattedSelectorOptions);
      dispatch({
        type: "mrca previewed",
        data: newFormattedSelectorOptions[0].value,
      });
    }
  }, [state.tree, state.mrcaOptions, sliderValue]);

  return (
    // Add labels to min/max on slider
    // Add reset button?
    // Ideally: make the marks bigger; make two "thumbs"; make date values nicer on hover
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        width: chartWidth,
        paddingLeft: 25,
        // border: "1px solid purple",
      }}
    >
      <div style={{ width: 300 }}>
        <FormControl fullWidth={true} margin="dense">
          <Slider
            aria-label="Use slider to select a hierarchical cluster (clade)"
            step={null}
            defaultValue={formattedSliderOptions[0].value}
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
      <div style={{ width: 100 }}>
        <Select
          variant="standard"
          value={state.previewMrca}
          defaultValue={formattedSelectorOptions[0].label}
          onChange={(event) =>
            dispatch({ type: "mrca previewed", data: event.target.value })
          }
          size="small"
          disabled={formattedSelectorOptions.length < 2}
        >
          {formattedSelectorOptions.map((o: any) => (
            <MenuItem value={o.value}>{o.label}</MenuItem>
          ))}
        </Select>
      </div>
      <div style={{ width: 100 }}>
        <Button
          variant="contained"
          size="small"
          disabled={!state.previewMrca}
          onClick={() => {
            dispatch({ type: "mrca confirmed", data: state.previewMrca });
            dispatch({ type: "mrca previewed", data: null });
          }}
          sx={{ backgroundColor: "#4f2379" }}
        >
          Confirm
        </Button>
      </div>
      <div>
        <FormControl>
          <React.Fragment key={"controlsDrawer"}>
            <Button
              variant="text"
              disableElevation
              disableRipple
              onClick={toggleDrawer("controlsDrawer", true)}
            >
              Filter and suggest clades
            </Button>
            <Drawer
              anchor={"right"}
              open={drawerOpen}
              onClose={toggleDrawer("right", false)}
            >
              <div style={{ width: windowWidth * 0.4 }}>
                <CladeFilterDrawer />
              </div>
            </Drawer>
          </React.Fragment>
          {/* @ts-ignore */}
          {/* <FormHelperText size="small">
            Samples of interest: <u>{state.samplesOfInterestNames.length}</u>
            <br />
            Clustering: <u>{state.clusteringMethod}</u>
            {state.clusteringMethod !== "none" &&
              state.clusteringMetadataField && (
                <>
                  {" "}
                  on <u>{state.clusteringMetadataField}</u>
                </>
              )}
          </FormHelperText> */}
        </FormControl>
      </div>
    </div>

    // onMouseEnter={() => {
    //             sethoverMRCA(node);
    //           }}
    //           onClick={() => {
    //             dispatch({ type: "mrca clicked", data: node });
    //           }}
  );
};

export default CladeSelectionVizControls;
