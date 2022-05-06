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
      Methods &#183; <a href="https://github.com/chanzuckerberg/galago">Code</a>{" "}
      &#183;{" "}
      <a href="https://github.com/chanzuckerberg/galago/discussions">
        Discussion
      </a>
      &#183; <a href="mailto:sbell@chanzuckerberg.com">Email</a>
      <br /> Galago: a little tree explorer made with &hearts; by Sidney Bell,
      PhD & Colin Megill
      <br /> with many thanks to the CZ Gen Epi team
      <br />
      &copy; 2017 - 2022 CZI &#183; MIT licensed
    </div>
  );
};

export default Footer;
