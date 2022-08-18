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
import { SkeletonReport } from "./skeleton";
import { useEffect, useState } from "react";

type ReportProps = {
  sectionHeight: number;
  sectionWidth: number;
};

export const Report = (props: ReportProps) => {
  const { sectionHeight, sectionWidth } = props;
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const reportReady = state.cladeDescription;

  const [animationFinished, setAnimationFinished] = useState<boolean>(false);

  useEffect(() => {
    setAnimationFinished(false);

    setTimeout(() => {
      setAnimationFinished(true);
    }, 500);
  }, [state.mrca.name]);

  return (
    <div
      style={{
        overflowY: "scroll",
        overflowX: "hidden",
        marginRight: 30,
        paddingRight: 30,
        width: sectionWidth,
        height: sectionHeight,
      }}
    >
      {" "}
      {reportReady && (
        <>
          <SitStat />
          <CladeDefinition sidenote_start={1} />
          <CladeUniqueness />
          <TMRCA sidenote_start={3} />
          <OnwardTransmission />
          <GeoSubclades />
          <SamplingBias
            // @ts-ignore
            gisaidCounts={gisaidCounts}
            sidenote_start={7}
          />
          <Assumptions sidenote_start={8} />
        </>
      )}
      {!reportReady && <SkeletonReport />}
    </div>
  );
};

export default Report;
