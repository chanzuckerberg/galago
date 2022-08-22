import Header from "../components/header";
import LandingPage from "../components/landingPage";

export const LandingPageRoute = () => {
  console.log("CI/CD appears to be working as expected!"); // REMOVE
  return (
    <div>
      <Header />
      <LandingPage />
    </div>
  );
};

export default LandingPageRoute;
