import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { useState, useCallback, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { orderSamples } from "../../../utils/filterHeatmapStrains";

type heatmapSampleSelectionProps = {
  maxSamples: number;
};

export const HeatmapSampleSelection = (props: heatmapSampleSelectionProps) => {
  // PROPS and GLOBAL STATE
  const { maxSamples } = props;
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  // confusingly, anchorEl is the way that MUI decides whether or not to show the poppper -- it's the element in the dom that the popper uses to position itself. You can mostly ignore this.
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // OPTIONS SETUP & STATE
  const getOptions = (
    pairwiseDistances: any,
    samplesOfInterestNames: string[]
  ) => {
    const strains = Object.keys(pairwiseDistances);
    return strains
      .map((strain: string) => {
        return {
          name: strain,
          group: samplesOfInterestNames.includes(strain)
            ? "Samples of interest"
            : "Other samples",
        };
      })
      .sort((a: any, b: any) => (a.group === "Samples of interest" ? -1 : 1));
  };

  const [options, setOptions] = useState<
    Array<{ name: string; group: string }>
  >(
    getOptions(
      state.cladeDescription.pairwiseDistances,
      state.cladeDescription.selected_samples
    )
  );

  const [selectedOptions, setSelectedOptions] = useState<
    Array<{ name: string; group: string }>
  >(
    options.filter((option: { name: string; group: string }) =>
      state.heatmapSelectedSampleNames.includes(option.name)
    )
  );

  useEffect(() => {
    const newOptions = getOptions(
      state.cladeDescription.pairwiseDistances,
      state.cladeDescription.selected_samples
    );
    setOptions(newOptions);
    const newSelectedOptions = newOptions.filter(
      (option: { name: string; group: string }) =>
        state.heatmapSelectedSampleNames.includes(option.name)
    );
    setSelectedOptions(newSelectedOptions);
  }, [state.mrca.name, state.heatmapSelectedSampleNames]);

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl && selectedOptions.length >= 2) {
      let selectedOptionNames = selectedOptions.map(
        (option: any) => option.name
      );
      dispatch({
        type: "heatmap selected samples changed",
        data: orderSamples(state.mrca, selectedOptionNames),
      });
    }
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // POPPER STATE and HANDLERS
  const open = Boolean(anchorEl);
  const checkOptionDisabled = useCallback(
    (option: any) =>
      selectedOptions.length >= maxSamples &&
      !selectedOptions.map((o: any) => o.name).includes(option.name),
    [selectedOptions]
  );

  return (
    <div>
      <Button
        variant="text"
        onClick={handleButtonClick}
        size="small"
        sx={{
          marginBottom: 1.5,
        }}
      >
        {`Choose samples (${state.heatmapSelectedSampleNames.length})`}
      </Button>

      <Popper open={open} anchorEl={anchorEl}>
        <Box
          sx={{
            border: 1,
            borderColor: "lightgray",
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <h5>Select between 4 and 50 samples to visualize in the heatmap.</h5>
          <Autocomplete
            id="heatmap-sample-selection"
            value={selectedOptions}
            onChange={(event: any, newValue: any) => {
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

export default HeatmapSampleSelection;
