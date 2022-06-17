import AboutGalago from "./aboutGalago";
import Upload from "./upload";
import Demo from "./demo";
import Footer from "../footer";
import ContactUs from "../contactUs";

export const LandingPage = () => {
  return (
    <div style={{ maxWidth: "40em", margin: "auto", marginTop: 100 }}>
      <AboutGalago />
      <Demo />
      <Upload />
      <div className="reportSection" style={{ marginBottom: 70 }}>
        <ContactUs />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
