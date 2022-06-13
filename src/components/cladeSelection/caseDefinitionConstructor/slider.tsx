type sliderProps = {
  field: string;
  min: number | object;
  max: number | object;
};

export const Slider = (props: sliderProps) => {
  const { field, min, max } = props;

  return (
    <>
      <input type="range" id={field} name={field} min={min} max={max}>
        <label>{field}</label>
      </input>
    </>
  );
};
