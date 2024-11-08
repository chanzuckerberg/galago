import { SitStat } from "./cladeSummary";
import Assumptions from "./assumptions";
import CladeDefinition from "./cladeDefinition";
import CladeUniqueness from "./cladeUniqueness";
import GeoSubclades from "./geoSubclades";
import OnwardTransmission from "./onwardTransmission";
import TMRCA from "./tmrca";
import { useSelector } from "react-redux";
import SamplingBias from "./sampleDistribTable";
import { gisaidCounts } from "../../../data/gisaidCounts2022-09";
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
      {reportReady && animationFinished && (
        <>
          <SitStat />
          <CladeDefinition />
          <CladeUniqueness />
          <TMRCA />
          <OnwardTransmission />
          <GeoSubclades />
          {state.pathogen === "sarscov2" && state.location && (
            // TODO: rewrite this to still be accurate and valuable for pathogens w/o reference data available
            // TODO: soften geo requirement, show whatever geo bins we do have
            <SamplingBias
              // @ts-ignore
              gisaidRecords={gisaidCounts}
            />
          )}
          <Assumptions sidenote_start={8} />
        </>
      )}
      {(!reportReady || !animationFinished) && <SkeletonReport />}
    </div>
  );
};

export default Report;
