// TYPES
import { Node, CladeDescription, GISAIDRecord } from "../d";
// HOOKS AND UTIL FUNCTIONS
import { useSelector, useDispatch } from "react-redux";
import { get_root, get_leaves } from "../utils/treeMethods";
// COMPONENTS
import Header from "../components/header";
import SamplingBias from "../components/report/sampleDistribTable";
import CladeDefinition from "../components/report/cladeDefinition";
import CladeUniqueness from "../components/report/cladeUniqueness";
import TMRCA from "../components/report/tmrca";
import OnwardTransmission from "../components/report/onwardTransmission";
import GeoSubclades from "../components/report/geoSubclades";
import Assumptions from "../components/report/assumptions";
import { SitStat } from "../components/cladeSummary";
import Footer from "../components/footer";
import ContactUs from "../components/contactUs";
import { gisaidCounts } from "../../data/gisaidCounts2022-06";
import { useNavigate } from "react-router-dom";

export default function ReportRoute() {
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);
  // const dispatch = useDispatch();

  // DATA

  const allDataPresent = state.cladeDescription && state.tree;
  let navigate = useNavigate();

  return (
    <div>
      <Header />
      {allDataPresent && (
        <>
          <h1>
            Investigation of a potential outbreak cluster in {state.location}
          </h1>
          <button
            onClick={(e: any) => {
              navigate("/galago/clustering");
            }}
          >
            Choose a different cluster
          </button>
          <SitStat />
          <CladeDefinition sidenote_start={1} />
          <CladeUniqueness />
          <TMRCA sidenote_start={3} />
          <OnwardTransmission sidenote_start={6} />
          <GeoSubclades />
          <SamplingBias
            // @ts-ignore
            gisaidCounts={gisaidCounts}
            all_samples={get_leaves(get_root(state.tree))}
            clade_description={state.cladeDescription}
            sidenote_start={7}
          />
          <Assumptions
            clade_description={state.cladeDescription}
            sidenote_start={8}
          />
          <ContactUs />
        </>
      )}
      {!allDataPresent && (
        <div>
          <h1>Woops! You need to upload data first</h1>
          <button
            onClick={() => {
              navigate("/galago/");
            }}
          >
            Get started
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}
