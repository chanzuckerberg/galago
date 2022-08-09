import SamplesOfInterest from "./samplesOfInterest";
import CaseDefinitionConstructor from "./caseDefinitionConstructor";
import ClusteringOptions from "./clusteringMethodSelect";
import { useWindowSize } from "@react-hook/window-size";
import Divider from "@mui/material/Divider";
import { IconButton } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { useDispatch } from "react-redux";

type CladeFilterDrawerProps = {
  drawerWidth: number;
};

export const CladeFilterDrawer = (props: CladeFilterDrawerProps) => {
  const { drawerWidth } = props;
  const dispatch = useDispatch();

  return (
    <div
      style={{
        width: drawerWidth,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 120,
      }}
    >
      {/* <Divider
        variant="middle"
        style={{ position: "relative", top: -20, left: -15, width: 250 }}
      /> */}

      <ClusteringOptions drawerWidth={drawerWidth} />
      <Divider variant="middle" style={{ marginTop: 30 }} />
      <SamplesOfInterest />
      <CaseDefinitionConstructor />
    </div>
  );
};

export default CladeFilterDrawer;
