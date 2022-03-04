type FormatDataPointProps = {
  value: any;
};

export const FormatDataPoint = (props: FormatDataPointProps) => {
  const { value } = props;
  return (
    <>
      {" "}
      <span className="dataPoint">{value}</span>{" "}
    </>
  );
};
