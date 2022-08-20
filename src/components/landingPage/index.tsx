import AboutGalago from "./aboutGalago";
import Upload from "./upload";
import Demo from "./demo";
import Footer from "../footer";
import ContactUs from "../contactUs";
import { useWindowSize } from "@react-hook/window-size";

export const LandingPage = () => {
  const [windowWidth, windowHeight] = useWindowSize();
  const middleWidth = Math.min(windowWidth * 0.5, 1200);
  return (
    <div style={{ maxWidth: middleWidth, margin: "auto" }}>
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
      <Footer />
    </div>
  );
};

export default LandingPage;
