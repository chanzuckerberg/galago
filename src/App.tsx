// TYPES
import { Node, CladeDescription, GISAIDRecord, GISAIDRawCounts } from "./d";
// HOOKS AND UTIL FUNCTIONS
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { get_root, get_leaves } from "./utils/treeMethods";
import { describe_clade } from "./utils/describeClade";
// DATA
import { gisaid_counts_file } from "../data/gisaid_counts";
// COMPONENTS
import Header from "./components/header";
import LandingPage from "./components/landingPage";
import SamplingBias from "./components/sampleDistribTable";
import CladeDefinition from "./components/cladeDefinition";
import CladeUniqueness from "./components/cladeUniqueness";
import TMRCA from "./components/tmrca";
import OnwardTransmission from "./components/onwardTransmission";
import GeoSubclades from "./components/geoSubclades";
import Assumptions from "./components/assumptions";
import { SitStat } from "./components/sitStat";
import SampleSelection from "./components/sampleSelection";
import Footer from "./components/footer";
import ContactUs from "./components/contactUs";
import CaseDefinitionConstructor from "./components/caseDefinitionConstructor";

function App() {
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  // LOCAL STATE
  const [minMutsToParent, setMinMutsToParent] = useState<number>(1);
  const [mutsPerTransMinMax, setMutsPerTransMinMax] = useState<number[]>([
    0, 2,
  ]);

  // DATA
  //@ts-ignore
  const gisaid_raw_counts = gisaid_counts_file;
  const gisaid_census = gisaid_raw_counts.data;

  return (
    <div>
      <Header />

      {(!state.tree ||
        !state.location ||
        !state.division ||
        !state.loadReport) && <LandingPage />}
      {state.location && state.division && state.tree && state.loadReport && (
        <div>
          <h1>Investigate potential outbreak clusters in {state.location}</h1>
          <SampleSelection />
          <CaseDefinitionConstructor />
        </div>
      )}

      {state.cladeDescription && state.tree && (
        <div>
          {/* <h2>Results</h2> */}
          <SitStat
            clade_description={state.cladeDescription}
            all_samples={get_leaves(state.tree)}
          />
          <CladeDefinition
            clade_description={state.cladeDescription}
            sidenote_start={1}
          />
          <TMRCA
            clade_description={state.cladeDescription}
            sidenote_start={3}
          />
          <GeoSubclades clade_description={state.cladeDescription} />
          <CladeUniqueness clade_description={state.cladeDescription} />
          <OnwardTransmission
            clade_description={state.cladeDescription}
            sidenote_start={6}
          />
          {/* <PhyloUncertainty clade_description={all_samples} /> */}
          {/* <h2>Considerations & Caveats</h2> */}
          <SamplingBias
            // @ts-ignore
            gisaid_census={gisaid_census}
            all_samples={get_leaves(get_root(state.tree))}
            clade_description={state.cladeDescription}
            sidenote_start={7}
          />
          <Assumptions
            clade_description={state.cladeDescription}
            sidenote_start={8}
          />
          <ContactUs />
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
