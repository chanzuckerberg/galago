import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  FormControl,
  FormGroup,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  calcMutsPerTransmissionMax,
  pathogenParameters,
} from "../../utils/pathogenParameters";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { tooltipProps } from "../formatters/sidenote";
import SettingsIcon from "@mui/icons-material/Settings";
//@ts-ignore
import uuid from "react-uuid";
import Theme from "../../theme";

export const PathogenSelection = () => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [genomeLength, setGenomeLength] = useState<number | "">("");
  const [serialInterval, setSerialInterval] = useState<number | "">("");
  const [subsPerSitePerYear, setSubsPerSitePerYear] = useState<number | "">("");

  useEffect(() => {
    if (state.pathogen) {
      if (state.pathogen === "other") {
        setShowCalculator(true);
        dispatch({
          type: "mutsPerTransMax updated",
          data: "",
        });
      }
      setGenomeLength(pathogenParameters[state.pathogen]["genomeLength"]);
      setSerialInterval(pathogenParameters[state.pathogen]["serialInterval"]);
      setSubsPerSitePerYear(
        pathogenParameters[state.pathogen]["subsPerSitePerYear"]
      );
    }
  }, [state.pathogen]);

  useEffect(() => {
    if (genomeLength && serialInterval && subsPerSitePerYear) {
      dispatch({
        type: "mutsPerTransMax updated",
        data: calcMutsPerTransmissionMax(
          genomeLength,
          subsPerSitePerYear,
          serialInterval,
          0.9
        ),
      });
    }
  }, [genomeLength, serialInterval, subsPerSitePerYear]);

  return (
    <div>
      <p>
        <FormControl>
          <FormLabel>Pathogen</FormLabel>

          <FormGroup row>
            <Select
              variant="standard"
              id="pathogen-select"
              value={state.pathogen}
              onChange={(event) => {
                dispatch({
                  type: "pathogen selected",
                  data: event.target.value,
                });
              }}
              label="Pathogen"
              style={{ width: 125 }}
            >
              {Object.keys(pathogenParameters).map((pathogen) => {
                return (
                  <MenuItem value={pathogen} key={uuid()}>
                    {pathogenParameters[pathogen]["name"]}
                  </MenuItem>
                );
              })}
            </Select>
            <IconButton
              size="small"
              color="primary"
              onClick={() => setShowCalculator(!showCalculator)}
            >
              <SettingsIcon />
            </IconButton>
          </FormGroup>
        </FormControl>
      </p>
      {state.pathogen && showCalculator && (
        //@ts-ignore
        <div
          style={{
            //@ts-ignore
            backgroundColor: Theme.palette.secondary.lighter,
            padding: 15,
          }}
        >
          <FormControl>
            <FormLabel sx={{ width: 400 }}>
              Max N mutations between directly linked samples
              <Tooltip
                componentsProps={tooltipProps}
                title={
                  "We estimate this threshold as the number of mutations such that P (N mutations | directly linked cases ) is <10%. This is based on a poisson distribution where lambda is the pathogen-specific average number of mutations per serial interval."
                }
              >
                <InfoOutlinedIcon
                  color="primary"
                  style={{
                    fontSize: 18,
                    position: "relative",
                    top: 4,
                    left: 4,
                  }}
                />
              </Tooltip>
            </FormLabel>

            <TextField
              id="outlined-number"
              variant="standard"
              type="number"
              value={state.mutsPerTransmissionMax}
              label={"Enter value"}
              onChange={(event) => {
                if (
                  parseInt(event.target.value) > 0 &&
                  parseInt(event.target.value) < 10
                ) {
                  dispatch({
                    type: "mutsPerTransMax updated",
                    data: parseInt(event.target.value),
                  });
                }
              }}
              error={
                state.mutsPerTransmissionMax < 1 ||
                state.mutsPerTransmissionMax > 9
              }
              sx={{ width: 100 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>{" "}
          <FormControl>
            <FormLabel>or calculate from:</FormLabel>
            <FormGroup row>
              <TextField
                variant="standard"
                type="number"
                value={genomeLength}
                label={"Genome length"}
                onChange={(event) => {
                  setGenomeLength(parseInt(event.target.value));
                }}
                size="small"
                style={{ marginRight: 10 }}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  genomeLength !== "" &&
                  (genomeLength < 1000 || genomeLength > 10000000)
                }
              />
              <TextField
                variant="standard"
                type="number"
                value={subsPerSitePerYear}
                label={"Subs per site per year"}
                onChange={(event) => {
                  setSubsPerSitePerYear(parseFloat(event.target.value));
                }}
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  subsPerSitePerYear !== "" &&
                  (subsPerSitePerYear <= 0 || subsPerSitePerYear > 1)
                }
                style={{ marginRight: 10 }}
              />
              <TextField
                variant="standard"
                type="number"
                value={serialInterval}
                label={"Serial interval (days)"}
                onChange={(event) => {
                  setSerialInterval(parseInt(event.target.value));
                }}
                error={
                  serialInterval !== "" &&
                  (serialInterval <= 0 || serialInterval > 1825)
                }
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormGroup>
          </FormControl>
        </div>
      )}
    </div>
  );
};

export default PathogenSelection;
