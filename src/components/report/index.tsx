import { SitStat } from "./cladeSummary";
import Assumptions from "./assumptions";
import CladeDefinition from "./cladeDefinition";
import CladeUniqueness from "./cladeUniqueness";
import GeoSubclades from "./geoSubclades";
import OnwardTransmission from "./onwardTransmission";
import TMRCA from "./tmrca";
import { useSelector } from "react-redux";
import { get_leaves, get_root } from "../../utils/treeMethods";
import SamplingBias from "./sampleDistribTable";
import { gisaidCounts } from "../../../data/gisaidCounts2022-06";

type ReportProps = {
  sectionHeight: number;
  sectionWidth: number;
};

export const Report = (props: ReportProps) => {
  const { sectionHeight, sectionWidth } = props;
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const allDataPresent = state.location && state.division && state.tree;
  const reportReady = state.cladeDescription && state.tree;

  return (
    <div
      style={{
        overflowY: "scroll",
        overflowX: "hidden",
        marginRight: 30,
        width: sectionWidth - 30,
        height: sectionHeight,
      }}
    >
      {" "}
      {allDataPresent && reportReady && (
        <>
          <SitStat />
          <CladeDefinition sidenote_start={1} />
          <CladeUniqueness />
          <TMRCA sidenote_start={3} />
          <OnwardTransmission sidenote_start={6} />
          <GeoSubclades />
          <SamplingBias
            // @ts-ignore
            gisaidCounts={gisaidCounts}
            sidenote_start={7}
          />
          <Assumptions sidenote_start={8} />
        </>
      )}
      {(!allDataPresent || !reportReady) && (
        <h2>Select a clade on the left to generate a report</h2>
      )}
    </div>
  );
};

export default Report;
