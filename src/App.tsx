import Header from "./components/header";
import Footer from "./components/footer";
import { useSelector, useDispatch } from "react-redux";
import { useWindowSize } from "@react-hook/window-size";
import MainViz from "./components/mainViz";
import Report from "./components/report";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function App() {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const [windowWidth, windowHeight] = useWindowSize();

  const headerHeight = 100;
  const sectionHeaderHeight = 100;
  const topSectionHeight = headerHeight + sectionHeaderHeight;
  const footerHeight = 50;
  const contentHeight = windowHeight - topSectionHeight - footerHeight;
  const contentWidth = windowWidth - 50 - 10;

  const leftColWidth = contentWidth * 0.45;
  const rightColWidth = contentWidth * 0.45;
  const showLayoutBorders = false;

  const [animationFinished, setAnimationFinished] = useState<boolean>(false);

  useEffect(() => {
    setAnimationFinished(false);

    setTimeout(() => {
      setAnimationFinished(true);
    }, 1000);
  }, [state.mrca.name]);

  return (
    <div>
      {/* <h1>Select a clade to instantly generate a report</h1> */}
      {/* left side bar */}
      <Header sectionHeight={headerHeight} sectionWidth={windowWidth - 10} />
      <div // all content
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          border: showLayoutBorders ? "1px solid red" : "none",
          height: contentHeight + sectionHeaderHeight,
          width: contentWidth,
          position: "relative",
          margin: "auto",
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
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h5>AUTOMATICALLY GENERATED REPORT FOR SELECTED CLADE</h5>
            {!animationFinished && (
              <div style={{ position: "relative", top: 20, left: 20 }}>
                <CircularProgress
                  variant="indeterminate"
                  size={20}
                  sx={{
                    "& .MuiCircularProgress-circle": {
                      // apply a new animation-duration to the `.bar` class
                      animationDuration: "1000ms",
                    },
                  }}
                />
              </div>
            )}
          </div>
          <Report sectionHeight={contentHeight} sectionWidth={rightColWidth} />
        </div>
      </div>
      <div style={{ width: 700, margin: "auto" }}>
        <Footer />
      </div>
    </div>
  );
}
