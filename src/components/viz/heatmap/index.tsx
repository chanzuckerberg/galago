import { useSelector, useDispatch } from "react-redux";
import { scaleLinear } from "@visx/scale";
import HeatmapLegend from "./heatmapLegend";
import HeatmapSampleSelection from "./heatmapSampleSelection";
import { useEffect, useState } from "react";
import { getDefaultSampleSet } from "../../../utils/filterHeatmapStrains";
import Theme from "../../../theme";
import { calcPairwiseDistances } from "../../../utils/treeMethods";
import { Node, PairwiseDistances } from "../../../d";

type heatmapProps = {
  chartWidth: number;
  chartHeight: number;
  chartMargin: number;
};

export const Heatmap = (props: heatmapProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const { chartWidth, chartHeight, chartMargin } = props;
  const maxSamples = 50; // TODO: make this responsive based on chartWidth
  const [hoveredPoint, setHoveredPoint] = useState<{
    xName: string;
    yName: string;
    value: number;
  } | null>(null);
  const [pairwiseDistances, setPairwiseDistances] =
    useState<PairwiseDistances>();
  const dataReady =
    state.cladeDescription &&
    state.heatmapSelectedSampleNames &&
    pairwiseDistances;

  useEffect(() => {
    const newDefaultSamples = getDefaultSampleSet(
      state.cladeDescription,
      maxSamples
    );
    setPairwiseDistances(calcPairwiseDistances(newDefaultSamples));
    dispatch({
      type: "heatmap selected samples changed",
      data: newDefaultSamples.map((sample: Node) => sample.name),
    });
  }, [state.mrca.name]);

  // SCALES;
  const gap = 1;

  let radius =
    Math.min(...[chartWidth - 2 * chartMargin, chartHeight - 2 * chartMargin]) /
    (state.heatmapSelectedSampleNames.length * 2.5);

  if (radius > 10) {
    radius = 15;
  } else if (radius < 3) {
    radius = 3;
  }

  const xScale = scaleLinear<number>({
    domain: [0, state.heatmapSelectedSampleNames.length * (radius * 2 + gap)],
    range: [0, chartWidth - 2 * chartMargin], //-2*chartMargin?
  });
  const yScale = scaleLinear<number>({
    domain: [
      0,
      (state.heatmapSelectedSampleNames.length - 1) * (radius * 2 + gap),
    ],
    range: [0, chartHeight - 2 * chartMargin], // -2*chartMargin?
  });

  // PLOT
  const getColor = (xName: string, yName: string) => {
    const threshold = state.cladeDescription?.muts_per_trans_minmax;
    const nMuts = pairwiseDistances[xName][yName];
    if (nMuts === 0) {
      return Theme.palette.primary.main;
    } else if (nMuts <= threshold * 2) {
      return Theme.palette.primary.light;
    } else {
      //@ts-ignore
      return Theme.palette.primary.lighter;
    }
  };

  // PLOT
  return (
    <div style={{ margin: "auto", width: "auto" }}>
      <div style={{ position: "relative", top: 10, left: 7 }}>
        <HeatmapSampleSelection maxSamples={50} />
      </div>

      {state.heatmapSelectedSampleNames.length > 3 && dataReady && (
        <svg width={chartWidth} height={chartHeight - 60}>
          <g id="heatmap circles">
            {state.heatmapSelectedSampleNames.map(
              (xName: string, xidx: number) => {
                return (
                  state.heatmapSelectedSampleNames
                    .slice(0, xidx)
                    // .reverse()
                    .map((yName: string, yidx: number) => (
                      <g>
                        <circle
                          cx={
                            chartWidth -
                            (chartMargin + xScale(xidx * 2 * radius + gap))
                          }
                          cy={
                            chartHeight -
                            2 * chartMargin -
                            yScale(yidx * 2 * radius + gap)
                          }
                          onMouseEnter={() => {
                            setHoveredPoint({
                              xName: xName,
                              yName: yName,
                              value: pairwiseDistances[xName][yName],
                            });
                          }}
                          onMouseLeave={() => setHoveredPoint(null)}
                          fill={getColor(xName, yName)}
                          r={radius}
                        />
                        {yidx === 0 && ( // x axis labels
                          <text
                            transform={`translate(${
                              chartWidth -
                              (chartMargin + xScale(xidx * 2 * radius + gap))
                            }, ${
                              chartHeight - 2 * chartMargin + radius + gap + 10
                            })rotate(-90)`}
                            fontSize={8}
                            dominantBaseline="middle"
                            textAnchor="end"
                          >
                            {xName}
                          </text>
                        )}
                        {xidx ===
                          state.heatmapSelectedSampleNames.length - 1 && ( // y-axis labels
                          <text
                            transform={`translate(${
                              chartWidth -
                              (chartMargin +
                                xScale(xidx * 2 * radius + gap) +
                                radius +
                                8)
                            }, ${
                              chartHeight -
                              2 * chartMargin -
                              yScale(yidx * 2 * radius + gap)
                            })`}
                            fontSize={8}
                            textAnchor="end"
                            dominantBaseline="middle"
                          >
                            {yName}
                          </text>
                        )}
                      </g>
                    ))
                );
              }
            )}
          </g>
          <g
            id="legend"
            transform={`translate(${chartWidth / 2} ${chartMargin})`}
          >
            <HeatmapLegend />
          </g>
          <g
            id="currentNode"
            transform={`translate(${chartWidth / 2 + radius} ${
              chartMargin + 70
            })`}
          >
            {hoveredPoint && (
              <text fontSize={12} fontWeight="bold">
                <tspan x="0" dy="1.2em">
                  {hoveredPoint.value} mut(s) between
                </tspan>
                <tspan x="0" dy="1.2em">
                  {hoveredPoint.xName} & {hoveredPoint.yName}
                </tspan>
              </text>
            )}
          </g>
        </svg>
      )}
    </div>
  );
};

export default Heatmap;
