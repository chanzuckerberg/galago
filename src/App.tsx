import Header from "./components/header";
import Footer from "./components/footer";
import { useSelector, useDispatch } from "react-redux";
import { useWindowSize } from "@react-hook/window-size";
import MainViz from "./components/mainViz";
import Report from "./components/report";
import { FormControl, IconButton, Drawer, FormHelperText } from "@mui/material";
import React from "react";
import CladeFilterDrawer from "./components/cladeFilterDrawer";
import CladeFilterDrawerClosed from "./components/cladeFilterDrawer/cladeFilterDrawerClosed";

export default function App() {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const [windowWidth, windowHeight] = useWindowSize();

  const drawerWidth = 250;
  const closedDrawerWidth = 50;

  const headerHeight = 100;
  const sectionHeaderHeight = 100;
  const topSectionHeight = headerHeight + sectionHeaderHeight;
  const footerHeight = 50;
  const contentHeight = windowHeight - topSectionHeight - footerHeight;
  const contentWidth = state.drawerOpen
    ? windowWidth - 50 - 290
    : windowWidth - 50;

  const leftColWidth = contentWidth * 0.45;
  const rightColWidth = contentWidth * 0.45;
  const showLayoutBorders = false;

  return (
    <div>
      {/* full page*/}
      <Header sectionHeight={headerHeight} sectionWidth={windowWidth} />
      <div // drawer + content
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          border: showLayoutBorders ? "1px solid red" : "none",
          height: contentHeight + sectionHeaderHeight,
          width: windowWidth,
          position: "relative",
          margin: "auto",
        }}
      >
        <div // drawer
          style={{
            width: state.drawerOpen ? drawerWidth : closedDrawerWidth,
            border: "1px solid blue",
          }}
        >
          <Drawer variant="permanent" open={state.drawerOpen}>
            {state.drawerOpen ? (
              <CladeFilterDrawer drawerWidth={drawerWidth} />
            ) : (
              <CladeFilterDrawerClosed closedDrawerWidth={closedDrawerWidth} />
            )}
          </Drawer>
        </div>

        <div
          style={{
            width: contentWidth,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
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
            <MainViz
              sectionWidth={leftColWidth}
              sectionHeight={contentHeight}
            />
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

            <Report
              sectionHeight={contentHeight}
              sectionWidth={rightColWidth}
            />
          </div>
        </div>
      </div>
      <div // footer
        style={{ width: 700, margin: "auto" }}
      >
        <Footer />
      </div>
    </div>
  );
}
