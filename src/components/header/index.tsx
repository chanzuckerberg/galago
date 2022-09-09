import { Helmet } from "react-helmet";
import { useWindowSize } from "@react-hook/window-size";
import { FetchError } from "./fetchErrorBanner";
import { BetaBanner } from "./betaBanner";
import StagingBanner from "./stagingBanner";
import InvalidJsonErrorBanner from "./invalidJsonBanner";
import { isAppRunningInStaging } from "src/utils/staging";

type HeaderProps = {
  sectionHeight?: number;
  sectionWidth?: number;
};

const Header = (props: HeaderProps) => {
  let { sectionHeight, sectionWidth } = props;
  const [windowWidth, windowHeight] = useWindowSize();

  sectionHeight ??= 100;
  sectionWidth ??= windowWidth - 10;

  return (
    <div
      style={{
        width: sectionWidth,
        height: sectionHeight,
        position: "relative",
        top: 0,
      }}
    >
      {isAppRunningInStaging() ? <StagingBanner /> : <BetaBanner />}
      <FetchError />
      <InvalidJsonErrorBanner />

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
