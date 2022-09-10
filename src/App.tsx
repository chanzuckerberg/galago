import Header from "./components/header";
import LittleFoot from "./components/littleFoot";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "@react-hook/window-size";
import MainViz from "./components/mainViz";
import Report from "./components/report";
import { ROUTES } from "src/routes";
import { useEffect } from "react";

export default function App() {
  /**
   * If user directly navigates to `App` route via URL, need to redirect home.
   *
   * The App route/component assumes that the user has loaded a tree. If there
   * is no tree and we try to render App, downstream components blow up.
   * To avoid this, we do a simple check to make sure that the `tree` value
   * in Redux is truth-y: we do have a tree. If we have a tree, proceed as
   * expected. If we do not have a tree, render `null` for this component
   * and let the `useEffect` catch the missing tree and redirect to homepage.
   *
   * Developer NOTE: It's possible this approach introduces a race condition.
   * If we push the user to the `App` component while the tree is being parsed
   * async, we might have a tree that is about to finish being loaded, but the
   * redirect process kicks off before tree load completes and we can never
   * manage to land on `App`. In my [Vince] testing, I have not been able to
   * get any problem like that to show up, but if such a problem does appear
   * down the road, here's a way to fix:
   * - Choose a sane timeout (2-5sec) for how a very slow tree load.
   * - Keep same useEffect logic, but put the `navigate` into a `setTimeout`
   *   based on sane timeout.
   * - If tree completes load before timeout is up, cancel the timeout in an
   *   `else` branch below (useEffect will fire again when the `tree` changes).
   * - If the tree has not loaded by timeout, navigate kicks off.
   * Like I said though, I haven't been able to make the race conditon show up.
   * I /think/ that right now the heavy tree parsing stuff happens before the
   * redux dispatch (which is async), so the actual redux reducer is very fast
   * compared to the route change, so we're safe. But if we move more of the
   * parsing into the reducer, we might be able to slow down that portion so
   * much that the route change beats out the redux state change. Nonetheless,
   * I think it's best to leave it with the easier approach below until we
   * actually see an issue with it (and we may never see such an issue!).
   */
  //@ts-ignore
  const stateTree = useSelector((state) => state.global.tree);
  const navigate = useNavigate();
  useEffect(() => {
    if (!stateTree) {
      // Ack, `App` will break without a tree, let's get outta here!
      navigate(ROUTES.HOMEPAGE);
    }
  }, [stateTree]);

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

  return stateTree ? (
    <div style={{ overflowX: "hidden", overflowY: "hidden" }}>
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
          <h5>AUTOMATICALLY GENERATED REPORT FOR SELECTED CLADE</h5>
          <Report sectionHeight={contentHeight} sectionWidth={rightColWidth} />
        </div>
      </div>
      <div
        style={{
          width: windowWidth,
          height: 20,
          position: "absolute",
          bottom: 10,
        }}
      >
        <LittleFoot />
      </div>
    </div>
  ) : null;
}
