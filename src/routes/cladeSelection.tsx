import Header from "../components/header";
import LandingPage from "../components/landingPage";
import Footer from "../components/footer";
import ContactUs from "../components/contactUs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SitStat } from "../components/cladeSummary";
import { get_leaves } from "../utils/treeMethods";
import EpiCurve from "../components/viz/epiCurve";
import SamplesOfInterest from "../components/cladeSelection/samplesOfInterest";
import ClusteringOptions from "../components/cladeSelection/clusteringMethodSelect";
import CaseDefinitionConstructor from "../components/cladeSelection/caseDefinitionConstructor";
import MutsDateScatter from "../components/viz/mutsDateScatter";
import { useWindowSize } from "@react-hook/window-size";

export default function SampleSelectionRoute() {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const [width, height] = useWindowSize();

  const allDataPresent =
    state.location && state.division && state.tree && state.loadReport;
  const reportReady = state.cladeDescription && state.tree;
  let navigate = useNavigate();

  return (
    <>
      {/* <h1>Select a clade to instantly generate a report</h1> */}
      {/* left side bar */}
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: width / 4,
            maxWidth: width / 4,
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          <SamplesOfInterest />
          <CaseDefinitionConstructor />
          <ClusteringOptions />
          {/* middle half */}
        </div>
        <div style={{ width: width / 2 }}>
          <MutsDateScatter />
        </div>
        <div
          style={{ overflowY: "auto", width: width / 4, overflowX: "hidden" }}
        >
          {reportReady ? (
            <>
              <h2>Genomic summary of your selected cluster</h2>
              <SitStat title={false} />
              <button
                onClick={(e) => {
                  navigate("/galago/report");
                }}
              >
                View full report
              </button>
            </>
          ) : (
            <p>Select a cluster to instantly generate a report</p>
          )}
        </div>
      </div>
      {/* report preview in right side bar */}

      {/* {!allDataPresent && (
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
        )} */}
      {/* <ContactUs />
      <Footer /> */}
    </>
  );
}
