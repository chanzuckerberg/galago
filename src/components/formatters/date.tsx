type formatDateProps = {
  date: Date;
};

export const FormatDate = (props: formatDateProps) => {
  const { date } = props;
  let formattedDate = "";
  try {
    formattedDate = date.toISOString().substring(0, 10);
  } catch (e) {}
  return <span className="dataPoint">{formattedDate}</span>;
};
