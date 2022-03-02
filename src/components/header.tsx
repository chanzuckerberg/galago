import { Helmet } from "react-helmet";

const Header = () => {
  return (
    <div>
      <p
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          fontSize: 24,
          margin: 0,
        }}
      >
        Galago
      </p>
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
