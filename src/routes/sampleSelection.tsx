import Header from "../components/header";
import LandingPage from "../components/landingPage";
import SampleSelection from "../components/sampleSelection";
import CaseDefinitionConstructor from "../components/caseDefinitionConstructor";
import Footer from "../components/footer";
import ContactUs from "../components/contactUs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SitStat } from "../components/sitStat";
import { get_leaves } from "../utils/treeMethods";
import EpiCurve from "../components/sitStat/epiCurve";

export default function SampleSelectionRoute() {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const allDataPresent =
    state.location && state.division && state.tree && state.loadReport;
  const reportReady = state.cladeDescription && state.tree;
  let navigate = useNavigate();

  return (
    <div>
      <Header />
      {allDataPresent && (
        <div>
          <h1>Investigate potential outbreak clusters in {state.location}</h1>
          <SampleSelection />
          <CaseDefinitionConstructor />
          <ContactUs />
        </div>
      )}

      {reportReady && (
        <>
          <SitStat
            clade_description={state.cladeDescription}
            all_samples={get_leaves(state.tree)}
          />
          <button
            onClick={(e) => {
              navigate("/galago/report");
            }}
          >
            View full report
          </button>
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
