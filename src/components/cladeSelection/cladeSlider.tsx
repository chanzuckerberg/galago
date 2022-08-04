import { useSelector, useDispatch } from "react-redux";
import Slider from "@mui/material/Slider";
import { getNodeAttr, traverse_preorder } from "../../utils/treeMethods";
import { Node } from "../../d";
import { useEffect, useState } from "react";
import { dateObjectToNumeric } from "../../utils/dates";
import {
  MenuItem,
  Select,
  Button,
  Drawer,
  FormControl,
  FormHelperText,
} from "@mui/material";
import React from "react";
import ControlsDrawer from "./controlsDrawer";
import { useWindowSize } from "@react-hook/window-size";
// import { timeFormat } from "d3-time-format";

export const CladeSlider = (props: { chartWidth: number }) => {
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

  const formatMrcaSliderOption = (n: Node) => {
    // retrieve slider value for given node, including converting from Date to number as needed
    let value, label;
    if (sliderField === "num_date") {
      const date: Date = getNodeAttr(n, "num_date");
      value = dateObjectToNumeric(date);
      //   label = timeFormat("%b %d")(date);
    } else {
      value = getNodeAttr(n, sliderField);
      //   label = value.toString();
    }
    return {
      value: value,
      label: label,
    };
  };

  // SLIDER STATE
  // Primary data structure for the slider; useEffect updates this whenever the tree or the mrcaOptions (i.e., filters on which mrcas to consider) change
  const [formattedSliderOptions, setFormattedSliderOptions] = useState<
    Array<{ value: number }>
  >(state.mrcaOptions.map((mrca: Node) => formatMrcaSliderOption(mrca)));

  useEffect(() => {
    if (state.tree && state.mrcaOptions) {
      setFormattedSliderOptions(
        state.mrcaOptions.map((mrca: Node) => formatMrcaSliderOption(mrca))
      );
    }
  }, [state.tree, state.mrcaOptions]);

  let [sliderValue, setSliderValue] = useState<number>(
    formattedSliderOptions[0].value
  );

  // SELECTOR DATA UTILS
  let sliderValueMrcasMap: { [key: string]: Node[] } = {};
  allMrcas.forEach((mrca: Node) => {
    const val: string = formatMrcaSliderOption(mrca)["value"].toString();
    if (Object.keys(sliderValueMrcasMap).includes(val)) {
      sliderValueMrcasMap[val].push(mrca);
    } else {
      sliderValueMrcasMap[val] = [mrca];
    }
  });

  const formatSelectorMrcaLabel = (mrca: Node) => {
    const tipCount = getNodeAttr(mrca, "tipCount");
    const niceName = mrca.name.replace("NODE_", "Clade ");
    return tipCount ? `${niceName} (${tipCount})` : niceName;
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
    // TODO: fix the padding and width on these
    // Add labels to min/max on slider
    // Add units next to slider
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
            min={Math.min(...formattedSliderOptions.map((o: any) => o.value))}
            max={Math.max(...formattedSliderOptions.map((o: any) => o.value))}
            size="medium"
          />
          <FormHelperText>
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
          disabled={
            state.mrca &&
            state.previewMrca &&
            state.mrca.name === state.previewMrca.name
          }
          // TODO: figure out why this blows everything up
          onClick={() => {
            dispatch({ type: "mrca confirmed", data: state.previewMrca });
          }}
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
                <ControlsDrawer />
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

export default CladeSlider;
