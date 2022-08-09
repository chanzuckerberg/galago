import SamplesOfInterest from "./samplesOfInterest";
import CaseDefinitionConstructor from "./caseDefinitionConstructor";
import ClusteringOptions from "./clusteringMethodSelect";
import { useWindowSize } from "@react-hook/window-size";
import Divider from "@mui/material/Divider";

type CladeFilterDrawerProps = {
  drawerWidth: number;
};

export const CladeFilterDrawer = (props: CladeFilterDrawerProps) => {
  const { drawerWidth } = props;

  return (
    <div style={{ width: drawerWidth, margin: "auto" }}>
      <h1>Filter & Suggest Clades</h1>
      <ClusteringOptions drawerWidth={drawerWidth} />
      <Divider variant="middle" style={{ margin: 30 }} />

      <SamplesOfInterest />
      <CaseDefinitionConstructor />
    </div>
  );
};

export default CladeFilterDrawer;
