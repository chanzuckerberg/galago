const Footer = () => {
  return (
    <div
      style={{
        //   alignSelf: "center",
        position: "relative",
        textAlign: "center",
        fontSize: ".7em",
      }}
    >
      <p style={{ width: 700, height: 10 }}>
        Galago: a little tree explorer made with &hearts; by the CZ Gen Epi team
        &#183; Content: CC0 licensed &#183;{" "}
        <a href="https://github.com/chanzuckerberg/galago">
          Code: MIT licensed
        </a>{" "}
      </p>
    </div>
  );
};

export default Footer;
