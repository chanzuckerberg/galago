const TextCell = (props: { text: string }) => {
  const { text } = props;
  return (
    <p
      style={{
        width: 150,
        textAlign: "right",
      }}
      key={text}
    >{`${text}`}</p>
  );
};

export default TextCell;
