import AboutGalago from "./aboutGalago";
import ContactUs from "./contactUs";
import Upload from "./upload";
import Demo from "./demo";
import Footer from "../footer";

export const LandingPage = () => {
  return (
    <div>
      <AboutGalago />
      <Demo />
      <Upload />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default LandingPage;
