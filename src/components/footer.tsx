const Footer = () => {
  return (
    <div
      style={{
        //   alignSelf: "center",
        position: "relative",
        textAlign: "center",
        fontSize: ".7em",
        maxWidth: "65em",
        paddingTop: "6em",
        paddingBottom: "0em",
      }}
    >
      <p style={{ maxWidth: "65em" }}>
        Galago: a little tree explorer made with &hearts; by Sidney Bell, PhD &
        Colin Megill
        <br /> with many thanks to the CZ Gen Epi team
      </p>
      <p style={{ maxWidth: "65em" }}>
        &copy; 2017 - 2022 CZI &#183; MIT licensed &#183;
        <a href="https://github.com/chanzuckerberg/galago"> Source code</a>
      </p>
    </div>
  );
};

export default Footer;
