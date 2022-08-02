type HeatmapAxesProps = {
  xScale: any;
  yScale: any;
  data: any;
  radius: number;
  yMax: number;
  chartMargin: number;
};

export const HeatmapAxes = (props: HeatmapAxesProps) => {
  const { xScale, yScale, data, radius, yMax, chartMargin } = props;
  return (
    <>
      {data.map((datum: any, i: number) => (
        <text
          transform={`translate(${radius + xScale(i)}, ${
            yMax + chartMargin / 3
          })rotate(45)`}
          fontSize={7}
          dominantBaseline="top"
          textAnchor="start"
        >
          {datum.strain}
        </text>
      ))}
      {data.map((datum: any, i: number) => (
        <text
          transform={`translate(${-8}, ${yScale(i) + radius})`}
          fontSize={8}
          textAnchor="end"
          dominantBaseline="middle"
        >
          {datum.strain}
        </text>
      ))}
    </>
  );
};

export default HeatmapAxes;
