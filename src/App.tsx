import Header from "./components/header";
import Footer from "./components/footer";
import ContactUs from "./components/contactUs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CaseDefinitionConstructor from "./components/cladeSelection/caseDefinitionConstructor";
import { useWindowSize } from "@react-hook/window-size";
import MainViz from "./components/mainViz";
import Report from "./components/report";

export default function SampleSelectionRoute() {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const [windowWidth, windowHeight] = useWindowSize();

  let navigate = useNavigate();

  const topSectionHeight = 100;
  const showLayoutBorders = false;

  return (
    <>
      {/* <h1>Select a clade to instantly generate a report</h1> */}
      {/* left side bar */}
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          border: showLayoutBorders ? "1px solid red" : "none",
        }}
      >
        <div
          style={{
            marginTop: topSectionHeight,
            width: windowWidth / 2,
            flexShrink: 0,
            border: showLayoutBorders ? "1px solid green" : "none",
          }}
        >
          <MainViz />
          {/* <div
            style={{
              width: windowWidth * 0.7,
              maxWidth: windowWidth * 0.7, // eventually windowWidth * leftSectionPercent
              flexShrink: 0,
              height: 100,
            }}
          >
            {/* <SamplesOfInterest /> */}
          {/* <CaseDefinitionConstructor /> */}
          {/* <ClusteringOptions /> */}
          {/* middle half*/}
          {/* </div> */}
        </div>
        <div
          style={{
            border: showLayoutBorders ? "1px solid pink" : "none",
            marginTop: topSectionHeight,
            width: windowWidth * 0.4,
          }}
        >
          <div
            style={{
              border: showLayoutBorders ? "1px solid orange" : "none",
              overflowY: "auto",
              margin: "auto",
              width: windowWidth * 0.35, // eventually windowWidth * rightSectionPercent
              height: windowHeight - topSectionHeight - 30, // eventually windowWidth - titleSectionHeightPixels
            }}
          >
            <Report />
          </div>
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
