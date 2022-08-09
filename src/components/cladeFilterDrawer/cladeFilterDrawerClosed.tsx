import {
  IconButton,
  Divider,
  FormHelperText,
  Chip,
  FormControl,
} from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector, useDispatch } from "react-redux";

type CladeFilterDrawerClosedProps = {
  closedDrawerWidth: number;
};

export const CladeFilterDrawerClosed = (
  props: CladeFilterDrawerClosedProps
) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const { closedDrawerWidth } = props;
  const dispatch = useDispatch();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: closedDrawerWidth,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 120,
      }}
    >
      <div style={{ marginLeft: "auto", marginRight: 0 }}>
        <IconButton onClick={() => dispatch({ type: "drawer toggled" })}>
          <ChevronRight style={{ fontSize: 32 }} />
        </IconButton>
      </div>
      <Divider variant="middle" style={{ margin: 10 }} />

      <FormControl margin="dense">
        <IconButton
          onClick={() => {
            dispatch({ type: "drawer toggled" });
          }}
        >
          <FilterAltIcon />
        </IconButton>
        <FormHelperText sx={{ margin: "auto" }}>Clustering</FormHelperText>
        <Chip
          label={
            state.clusteringMethod !== "none" &&
            state.clusteringMetadataField ? (
              <>
                {state.clusteringMethod}
                on {state.clusteringMetadataField}
              </>
            ) : (
              "none"
            )
          }
          size="small"
        />
      </FormControl>

      {/* <Divider variant="middle" style={{ margin: 10 }} /> */}
      <FormControl margin="dense">
        <IconButton
          onClick={() => {
            dispatch({ type: "drawer toggled" });
          }}
        >
          <SearchIcon />
        </IconButton>
        <FormHelperText sx={{ margin: "auto" }}>Samples</FormHelperText>
        <Chip label={state.samplesOfInterestNames.length} size="small" />
      </FormControl>
    </div>
  );
};

export default CladeFilterDrawerClosed;
