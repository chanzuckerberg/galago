import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { useState, useCallback } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { MutDistances } from "../../../d";
import SamplesOfInterest from "../../cladeSelection/samplesOfInterest";
import { filterToIncludedSamples } from "../../../utils/filterHeatmapStrains";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type heatmapLegendProps = {
  rawData: Array<MutDistances>;
  filteredData: Array<MutDistances>;
  setFilteredData: any;
  maxSamples: number;
};

export const heatmapSampleSelection = (props: heatmapLegendProps) => {
  // PROPS and GLOBAL STATE
  const { rawData, filteredData, setFilteredData, maxSamples } = props;
  //@ts-ignore
  const state = useSelector((state) => state.global);
  // confusingly, anchorEl is the way that MUI decides whether or not to show the poppper -- it's the element in the dom that the popper uses to position itself. You can mostly ignore this.
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // OPTIONS SETUP & STATE
  const options: Array<{ name: string; group: string }> = rawData
    .map((datum: MutDistances) => {
      return {
        name: datum.strain,
        group: state.samplesOfInterestNames.includes(datum.strain)
          ? "Samples of interest"
          : "Other samples",
      };
    })
    .sort((a: any, b: any) => (a.group === "Samples of interest" ? -1 : 1));

  console.log("props", props, "options N", options.length);

  const initialSelectedOptions = options.filter(
    (option: { name: string; group: string }) =>
      filteredData.map((d: MutDistances) => d.strain).includes(option.name)
  );

  const [selectedOptions, setSelectedOptions] = useState<
    Array<{ name: string; group: string }>
  >(initialSelectedOptions);

  // POPPER STATE and HANDLERS
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  const checkOptionDisabled = useCallback(
    (option: any) =>
      selectedOptions.length >= maxSamples &&
      !selectedOptions.map((o: any) => o.name).includes(option.name),
    [selectedOptions]
  );
  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl && selectedOptions.length >= 2) {
      let selectedOptionNames = selectedOptions.map(
        (option: any) => option.name
      );
      let thisfiltereddata = filterToIncludedSamples(
        rawData,
        selectedOptionNames
      );
      console.log(
        "filtering data",
        selectedOptionNames.length,
        thisfiltereddata.length
      );
      setFilteredData(thisfiltereddata);
    }
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  return (
    <div>
      <Button variant="text" onClick={handleButtonClick} size="small">
        {`Choose samples (${selectedOptions.length})`}
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Box
          sx={{
            border: 1,
            borderColor: "lightgray",
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <h5>Select up to 50 samples to visualize in the heatmap.</h5>
          <Autocomplete
            id="heatmap-sample-selection"
            value={selectedOptions}
            onChange={(event: any, newValue: any) => {
              console.log("setting selected options to", newValue.length);
              setSelectedOptions(newValue);
            }}
            options={options}
            groupBy={(option: any) => option.group}
            isOptionEqualToValue={(option: any, value: any) =>
              option.name === value.name
            }
            getOptionLabel={(option: any) => option.name}
            getOptionDisabled={checkOptionDisabled}
            multiple
            disableCloseOnSelect
            filterSelectedOptions
            style={{ width: 750 }}
            renderInput={(params) => (
              <TextField {...params} label="Heatmap samples" />
            )}
          />
        </Box>
      </Popper>
    </div>
  );
};

export default heatmapSampleSelection;
