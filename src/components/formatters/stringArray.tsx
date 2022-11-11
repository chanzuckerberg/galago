import { FormatDataPoint } from "./dataPoint";

type stringArrayProps = {
  values: string[];
  includeUnknown?: boolean;
  makeUnique?: boolean;
};

export const FormatStringArray = (props: stringArrayProps) => {
  let { values, includeUnknown, makeUnique } = props;

  includeUnknown ??= false;
  makeUnique ??= true;

  const unknownValues = [undefined, null, "unknown", "?", "", NaN];
  values = includeUnknown
    ? values
    : values.filter((v) => !unknownValues.includes(v));

  values = makeUnique ? [...new Set(values)] : values;

  values.sort();

  if (values.length === 1) {
    return <FormatDataPoint value={values[0]} />;
  }

  return (
    <blockquote className="dataPoint">
      {values.slice(0, -1).map((v, i) => (
        <span key={`${i}-${v}`}>{v}, </span>
      ))}
      {values.slice(-1)[0]}
    </blockquote>
  );
};
