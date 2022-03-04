type stringArrayProps = {
  values: string[];
  includeUnknown?: boolean;
  makeUnique?: boolean;
};

export const FormatStringArray = (props: stringArrayProps) => {
  let { values, includeUnknown, makeUnique } = props;
  includeUnknown = includeUnknown === undefined ? true : includeUnknown;
  makeUnique = makeUnique === undefined ? true : makeUnique;
  console.log(values, includeUnknown, makeUnique);
  const unknownValues = [undefined, null, "unknown", "?", "", NaN];
  values = includeUnknown
    ? values
    : values.filter((v) => unknownValues.includes(v));

  values = makeUnique ? [...new Set(values)] : values;

  values.sort();

  return (
    <blockquote className="dataPoint">
      {values.slice(0, -1).map((v) => (
        <>{v}, </>
      ))}
      {values.slice(-1)[0]}
    </blockquote>
  );
};
