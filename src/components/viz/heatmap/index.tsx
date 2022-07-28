import { useSelector } from "react-redux";
import { HeatmapCircle } from "@visx/heatmap";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import HeatmapLegend from "./heatmapLegend";
import HeatmapSampleSelection from "./heatmapSampleSelection";
import { useState } from "react";
import { HeatmapAxes } from "./heatmapAxes";
import { MutDistances } from "../../../d";
import {
  filterToIncludedSamples,
  getDefaultSampleSet,
} from "../../../utils/filterHeatmapStrains";

type heatmapProps = {
  chartWidth: number;
  chartHeight: number;
  chartMargin: number;
};

export const Heatmap = (props: heatmapProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const { chartWidth, chartHeight, chartMargin } = props;

  const rawData = state.cladeDescription.pairwiseDistances;
  const maxSamples = 50; // TODO: make this responsive based on chartWidth

  const [filteredData, setFilteredData] = useState<Array<MutDistances>>(
    filterToIncludedSamples(
      rawData,
      getDefaultSampleSet(rawData, state.samplesOfInterestNames, maxSamples)
    )
  );

  // ACCESSORS
  const bins = (d: any) => d.distances;
  const count = (d: any) => {
    const [lower, upper] = state.cladeDescription?.muts_per_trans_minmax;
    let nMuts = d.dist;
    if (nMuts === 0) {
      return 0;
    } else if (nMuts <= upper) {
      return 1.5;
    } else {
      return 3;
    }
  };

  // SCALES;
  function max<Datum>(
    filteredData: Datum[],
    value: (d: Datum) => number
  ): number {
    return Math.max(...filteredData.map(value));
  }
  function min<Datum>(
    filteredData: Datum[],
    value: (d: Datum) => number
  ): number {
    return Math.min(...filteredData.map(value));
  }
  const colorMax = 3; //max(filteredData, (d) => max(bins(d), count));
  const bucketSizeMax = max(filteredData, (d) => bins(d).length);

  const xScale = scaleLinear<number>({
    domain: [0, filteredData.length],
  });
  const yScale = scaleLinear<number>({
    domain: [0, bucketSizeMax],
  });

  const darkPurple = "#4f2379";
  const lightPurple = "#d9cde3";
  const circleColorScale = scaleLinear<string>({
    range: [darkPurple, lightPurple],
    domain: [0, colorMax],
  });

  // BOUNDS
  const xMax = chartWidth - 2 * chartMargin;
  const yMax = chartHeight - 2 * chartMargin;

  const binWidth = xMax / filteredData.length;
  const binHeight = yMax / bucketSizeMax;
  const radius = min([binWidth, binHeight], (d) => d) / 2 - 1;

  xScale.range([0, xMax]);
  yScale.range([yMax, 0]);

  console.log("filtered data updated", filteredData);

  // PLOT
  return state.cladeDescription.pairwiseDistances < 4 ? null : (
    <div style={{ margin: "auto", width: "auto" }}>
      <div style={{ position: "relative", top: 10, left: 7 }}>
        <HeatmapSampleSelection
          rawData={rawData}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          maxSamples={50}
        />
      </div>
      <svg width={chartWidth} height={chartHeight - 60}>
        <rect
          x={0}
          y={0}
          width={chartWidth}
          height={chartHeight}
          fill={"white"}
        />
        <Group id="heatmap" left={chartMargin}>
          <HeatmapCircle
            data={filteredData}
            xScale={(d) => xScale(d) ?? 0}
            yScale={(d) => yScale(d) ?? 0}
            colorScale={circleColorScale}
            bins={bins}
            count={count}
            //   opacityScale={opacityScale}
          >
            {(heatmap) =>
              heatmap.map((heatmapBins) =>
                heatmapBins.map((bin) => (
                  <circle
                    key={`heatmap-circle-${bin.row}-${bin.column}`}
                    className="visx-heatmap-circle"
                    cx={bin.cx}
                    cy={bin.cy}
                    r={radius}
                    fill={bin.color}
                    fillOpacity={bin.opacity}
                    //   onClick={() => {
                    //     if (!events) return;
                    //     const { row, column } = bin;
                    //     alert(JSON.stringify({ row, column, bin: bin.bin }));
                    //   }}
                  />
                ))
              )
            }
          </HeatmapCircle>
        </Group>
        <g id="axis-labels" transform={`translate(${chartMargin} 0)`}>
          <HeatmapAxes
            xScale={xScale}
            yScale={yScale}
            data={filteredData}
            radius={radius}
            yMax={yMax}
            chartMargin={chartMargin}
          />
        </g>
        <g
          id="legend"
          transform={`translate(${chartWidth / 2} ${chartMargin / 3 + 5})`}
        >
          <HeatmapLegend circleColorScale={circleColorScale} />
        </g>
      </svg>
    </div>
  );
};

export default Heatmap;
