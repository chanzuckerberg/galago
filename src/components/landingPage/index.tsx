import AboutGalago from "./aboutGalago";
import Upload from "./upload";
import Demo from "./demo";
import Footer from "../footer";
import ContactUs from "../contactUs";
import { useWindowSize } from "@react-hook/window-size";

export const LandingPage = () => {
  const [windowWidth, windowHeight] = useWindowSize();

  return (
    <div style={{ maxWidth: windowWidth * 0.5, margin: "auto" }}>
      <AboutGalago />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Demo />
        <Upload />
      </div>

      <div className="reportSection" style={{ marginBottom: 70 }}>
        <ContactUs />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
