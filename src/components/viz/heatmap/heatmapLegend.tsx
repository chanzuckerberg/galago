import { useSelector } from "react-redux";

type heatmapLegendProps = {
  circleColorScale: any;
  radius: number;
  data: any;
  rawData: any;
};

export const heatmapLegend = (props: heatmapLegendProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const { circleColorScale, radius, data, rawData } = props;

  return (
    <>
      <g>
        <circle fill={circleColorScale(0)} r={radius * 1.5} cx={0} cy={0} />
        <text fontSize={10} x={radius * 3} y={0} dominantBaseline="middle">
          "Identical (0 muts)"
        </text>
      </g>
      <g>
        <circle
          fill={circleColorScale(1.5)}
          r={radius * 1.5}
          cx={0}
          cy={radius * 4}
        />
        <text
          fontSize={10}
          x={radius * 3}
          y={radius * 4}
          dominantBaseline="middle"
        >
          {`1-2 transmissions\n(1
        - ${state.cladeDescription.muts_per_trans_minmax[1] * 2} muts)`}
        </text>
      </g>
      <g>
        <circle
          fill={circleColorScale(3)}
          r={radius * 1.5}
          cx={0}
          cy={radius * 8}
        />
        <text
          fontSize={10}
          x={radius * 3}
          y={radius * 8}
          dominantBaseline="middle"
        >
          {`3+ transmissions (${
            state.cladeDescription.muts_per_trans_minmax[1] * 2 + 1
          }+ muts)`}
        </text>
      </g>
    </>
  );
};

export default heatmapLegend;
