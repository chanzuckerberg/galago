import { Helmet } from "react-helmet";
import { useWindowSize } from "@react-hook/window-size";
import { BetaBanner } from "./betaBanner";
import StagingBanner from "./stagingBanner";
import { isAppRunningInStaging } from "src/utils/staging";
import { useSelector } from "react-redux";
import { GenericErrorBanner } from "./genericErrorBanner";
// import StagingBanner from "./stagingBanner";

type HeaderProps = {
  sectionHeight?: number;
  sectionWidth?: number;
};

const Header = (props: HeaderProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  let { sectionHeight, sectionWidth } = props;
  const [windowWidth, windowHeight] = useWindowSize();

  sectionHeight ??= 100;
  sectionWidth ??= windowWidth - 10;

  const errorTypesToDisplay = Object.keys(state.showErrorMessages).filter(
    (errorType: string) => state.showErrorMessages[errorType] === true
  );

  return (
    <div
      style={{
        width: sectionWidth,
        height: sectionHeight,
        position: "relative",
        top: 0,
      }}
    >
      {/* TODO: similarly refactor generic info alert messages into a centralized util file
        and corresponding piece of global state; use this to set the `top` attribute passed to error alerts below.
      */}
      {isAppRunningInStaging() ? <StagingBanner /> : <BetaBanner />}

      {errorTypesToDisplay.map((errorType: string, i: number) => (
        <GenericErrorBanner errorType={errorType} top={95 + 110 * i} />
      ))}

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          fontSize: 24,
          margin: 0,
        }}
      >
        <img
          src="https://github.com/chanzuckerberg/galago-labs/raw/main/src/images/galago-logo.svg"
          height={50}
        />
      </div>
      <Helmet>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`Galago`}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Helmet>
    </div>
  );
};

export default Header;
