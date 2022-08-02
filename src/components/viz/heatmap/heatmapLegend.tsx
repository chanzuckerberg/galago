import { useSelector } from "react-redux";

type heatmapLegendProps = {
  circleColorScale: any;
};

export const heatmapLegend = (props: heatmapLegendProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const { circleColorScale } = props;
  const spacing = 5;

  return (
    <>
      <g>
        <circle fill={circleColorScale(0)} r={spacing * 1.5} cx={0} cy={0} />
        <text fontSize={10} x={spacing * 3} y={0} dominantBaseline="middle">
          "Identical (0 muts)"
        </text>
      </g>
      <g>
        <circle
          fill={circleColorScale(1.5)}
          r={spacing * 1.5}
          cx={0}
          cy={spacing * 4}
        />
        <text
          fontSize={10}
          x={spacing * 3}
          y={spacing * 4}
          dominantBaseline="middle"
        >
          {`1-2 transmissions\n(1
        - ${state.cladeDescription.muts_per_trans_minmax[1] * 2} muts)`}
        </text>
      </g>
      <g>
        <circle
          fill={circleColorScale(3)}
          r={spacing * 1.5}
          cx={0}
          cy={spacing * 8}
        />
        <text
          fontSize={10}
          x={spacing * 3}
          y={spacing * 8}
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
