import Header from "./components/header";
import Footer from "./components/footer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "@react-hook/window-size";
import MainViz from "./components/mainViz";
import Report from "./components/report";

export default function App() {
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
          <h5>CHOOSE CLADE / CLUSTER TO INVESTIGATE</h5>
          <MainViz />
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
            <h5>AUTOMATICALLY GENERATED REPORT</h5>

            <Report />
          </div>
        </div>
      </div>
      <div style={{ width: 500, margin: "auto" }}>
        <Footer />
      </div>
    </>
  );
}
