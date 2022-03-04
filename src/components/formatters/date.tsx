type formatDateProps = {
  date: Date;
};

export const FormatDate = (props: formatDateProps) => {
  const { date } = props;
  return (
    <span className="dataPoint">{date.toISOString().substring(0, 10)}</span>
  );
};
