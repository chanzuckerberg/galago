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
      <ContactUs />
      <Footer />
    </div>
  );
};

export default LandingPage;
