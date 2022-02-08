const TextCell = (props: { text: string }) => {
  const { text } = props;
  return (
    <p
      style={{
        width: 150,
        textAlign: "right",
        fontSize: 14,
      }}
      key={text}
    >{`${text}`}</p>
  );
};

export default TextCell;
