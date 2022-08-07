import Header from "./components/header";
import Footer from "./components/footer";
import { useSelector, useDispatch } from "react-redux";
import { useWindowSize } from "@react-hook/window-size";
import MainViz from "./components/mainViz";
import Report from "./components/report";

export default function App() {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const [windowWidth, windowHeight] = useWindowSize();

  const headerHeight = 60;
  const sectionHeaderHeight = 100;
  const topSectionHeight = headerHeight + sectionHeaderHeight;
  const footerHeight = 50;
  const leftColWidth = windowWidth * 0.45;
  const rightColWidth = windowWidth * 0.45;
  const contentHeight = windowHeight - topSectionHeight - footerHeight;
  const showLayoutBorders = false;

  return (
    <>
      {/* <h1>Select a clade to instantly generate a report</h1> */}
      {/* left side bar */}
      <Header sectionHeight={headerHeight} sectionWidth={windowWidth} />
      <div // all content
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          border: showLayoutBorders ? "1px solid red" : "none",
          height: contentHeight + sectionHeaderHeight,
          width: windowWidth,
        }}
      >
        <div // left column
          style={{
            // marginTop: topSectionHeight,
            width: leftColWidth,
            height: contentHeight,
            flexShrink: 0,
            border: showLayoutBorders ? "1px solid green" : "none",
            paddingLeft: 30,
          }}
        >
          <h5>CHOOSE HIERARCHICAL CLUSTER ("CLADE") TO INVESTIGATE</h5>
          <MainViz sectionWidth={leftColWidth} sectionHeight={contentHeight} />
        </div>

        <div // right column
          style={{
            width: rightColWidth,
            height: contentHeight,
            flexShrink: 0,
            border: showLayoutBorders ? "1px solid pink" : "none",
            paddingRight: 30,
          }}
        >
          <h5>AUTOMATICALLY GENERATED REPORT FOR SELECTED CLADE</h5>

          <Report sectionHeight={contentHeight} sectionWidth={rightColWidth} />
        </div>
      </div>
      <div style={{ width: 700, margin: "auto" }}>
        <Footer />
      </div>
    </>
  );
}
