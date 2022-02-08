const TextCell = (props: { text: string }) => {
  const { text } = props;
  return (
    <p
      style={{
        width: 150,
        textAlign: "right",
        fontSize: 12,
        fontWeight: 700,
        fontFamily:
          "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
      }}
      key={text}
    >{`${text}`}</p>
  );
};

export default TextCell;
