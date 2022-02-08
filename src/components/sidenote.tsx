const Sidenote = (props: { text: string | any; num: number }) => {
  const { text, num } = props;
  return (
    <span
      style={{
        float: "right",
        clear: "right",
        marginRight: "-25em",
        width: "17em", // half the main paragraph
        marginTop: 0,
        marginBottom: 0,
        fontSize: 12,
        lineHeight: 1.3,
        verticalAlign: "baseline",
        position: "relative",
      }}
    >
      <sup style={{ marginRight: 2 }}>{num}</sup>
      {text}
    </span>
  );
};
export default Sidenote;
