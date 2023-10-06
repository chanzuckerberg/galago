import { useSelector, useDispatch } from "react-redux";
import { Button, IconButton, Tooltip } from "@mui/material";
import CladeFilterDrawer from "../../cladeFilterDrawer";
import { tooltipProps } from "../../formatters/sidenote";
import CladeCaption from "./cladeCaption";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { dateObjectToNumeric } from "src/utils/dates";

type CladeSelectionVizControlsProps = {
  sectionWidth: number;
};

export const CladeSelectionVizControls = (
  props: CladeSelectionVizControlsProps
) => {
  const { sectionWidth } = props;

  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  return (
    <div
      id="clade selection viz controls"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        position: "relative",
        width: sectionWidth,
      }}
    >
      <div
        id="left-controls"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <div id="clade filter drawer toggle button">
          <Tooltip
            title={"Locate samples of interest and filter clades"}
            componentsProps={tooltipProps}
          >
            <Button
              onClick={() => dispatch({ type: "filter drawer opened" })}
              sx={{
                margin: 0,
                minWidth: 125,
              }}
              variant="contained"
            >
              Search & filter
            </Button>
          </Tooltip>
        </div>
        <div
          id="clade caption"
          style={{ width: 225, position: "relative", top: -25, marginLeft: 25 }}
        >
          <CladeCaption />
        </div>
      </div>
      <div id="zoom controls" style={{ minWidth: 125 }}>
        <Tooltip
          title={"Zoom out one level (to parent clade)"}
          componentsProps={tooltipProps}
        >
          <IconButton
            size="large"
            onClick={() =>
              dispatch({
                type: "mrca selected",
                data: state.mrca.parent?.name,
              })
            }
            sx={{
              margin: 0,
              color: !state.mrca.parent ? "gray" : "black",
            }}
            disabled={!state.mrca.parent}
          >
            <MoveUpIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={"Zoom out (to root)"} componentsProps={tooltipProps}>
          <IconButton
            onClick={() =>
              dispatch({
                type: "mrca selected",
                data: state.tree.name,
              })
            }
            size="large"
            sx={{
              margin: 0,
              color: state.tree.name === state.mrca.name ? "gray" : "black",
            }}
            disabled={state.tree.name === state.mrca.name}
          >
            <ZoomOutMapIcon />
          </IconButton>
        </Tooltip>
      </div>

      <CladeFilterDrawer />
    </div>
  );
};

export default CladeSelectionVizControls;
