import AboutGalago from "./aboutGalago";
import Upload from "./upload";
import Demo from "./demo";
import ContactUs from "../contactUs";
import { useWindowSize } from "@react-hook/window-size";
import BigFoot from "../bigFoot";

export const LandingPage = () => {
  const [windowWidth, windowHeight] = useWindowSize();
  const middleWidth = Math.min(windowWidth * 0.66, 1200);
  const headerHeight = 100;
  const footerHeight = 130;
  const contentMarginBottom = 50;
  return (
    <div>
      <div
        style={{
          maxWidth: middleWidth,
          margin: "auto",
          minHeight:
            windowHeight - (footerHeight + headerHeight + contentMarginBottom),
          marginBottom: contentMarginBottom,
        }}
      >
        <AboutGalago />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Demo sectionWidth={middleWidth * 0.43} />
          <Upload sectionWidth={middleWidth * 0.43} />
        </div>

        <div style={{ marginBottom: 30, marginTop: 30 }}>
          <ContactUs />
        </div>
      </div>
      <BigFoot />
    </div>
  );
};

export default LandingPage;
