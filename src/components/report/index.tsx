import { SitStat } from "./cladeSummary";
import Assumptions from "./assumptions";
import CladeDefinition from "./cladeDefinition";
import CladeUniqueness from "./cladeUniqueness";
import GeoSubclades from "./geoSubclades";
import OnwardTransmission from "./onwardTransmission";
import TMRCA from "./tmrca";
import { useSelector } from "react-redux";

export const Report = () => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  // const allDataPresent =
  //   state.location && state.division && state.tree && state.loadReport;
  const reportReady = state.cladeDescription && state.tree;

  return (
    <div>
      <SitStat />
      <CladeDefinition sidenote_start={1} />
      <CladeUniqueness />
      <TMRCA sidenote_start={3} />
      <OnwardTransmission sidenote_start={6} />
      <GeoSubclades />
      {/* <SamplingBias
      // @ts-ignore
      gisaidCounts={gisaidCounts}
      all_samples={get_leaves(get_root(state.tree))}
      clade_description={state.cladeDescription}
      sidenote_start={7}
    /> */}
      <Assumptions sidenote_start={8} />
    </div>
  );
};

export default Report;
