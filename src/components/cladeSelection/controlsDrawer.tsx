import SamplesOfInterest from "./samplesOfInterest";
import CaseDefinitionConstructor from "./caseDefinitionConstructor";
import ClusteringOptions from "./clusteringMethodSelect";
import { useWindowSize } from "@react-hook/window-size";
import Divider from "@mui/material/Divider";

export const ControlsDrawer = () => {
  const [windowWidth, windowHeight] = useWindowSize();

  return (
    <div style={{ width: windowWidth * 0.3, margin: "auto", marginTop: 50 }}>
      <h1>Filter & Suggest Clades</h1>
      <ClusteringOptions />
      <Divider variant="middle" style={{ margin: 30 }} />

      <SamplesOfInterest />
      <CaseDefinitionConstructor />
    </div>
  );
};

export default ControlsDrawer;
