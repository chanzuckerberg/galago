import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import { BarStack } from "@visx/shape";
import { SeriesPoint } from "@visx/shape/lib/types";
import { Group } from "@visx/group";
import { Grid } from "@visx/grid";
import { AxisBottom } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { timeParse, timeFormat } from "d3-time-format";
// import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { LegendOrdinal } from "@visx/legend";
import { getNodeAttr, get_dist, traverse_preorder } from "../utils/treeMethods";
import { Node } from "../d";

export const EpiCurve = () => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const nodes = traverse_preorder(state.mrca);

  const [colorBy, setColorBy] = useState<"transmissions" | "geography">(
    "transmissions"
  );

  const chartSize = {
    height: 560,
    width: 960,
    margin: 30,
  };
  const purple1 = "#6c5efb";
  const purple2 = "#c998ff";
  const purple3 = "#a44afe";
  const background = "#eaedff";

  const keys =
    colorBy === "transmissions"
      ? [
          "Plausible primary case",
          "Primary or secondary case",
          "Likely tertiary+ case",
        ]
      : [
          state.location,
          `Other counties in ${state.division}`,
          `Other states in ${state.country}`,
          "Other countries",
        ];

  // accessors
  const getTransmissions = (node: Node) => {
    const nMuts = get_dist([node, state.mrca]);
    const [lower, upper] = state.cladeDescription?.muts_per_trans_minmax;
    if (nMuts === 0) {
      return "Plausible primary case";
    } else if (nMuts <= upper) {
      return "Primary or secondary case";
    } else {
      return "Likely tertiary+ case";
    }
  };

  const getGeography = (node: Node) => {
    const nodeLocation = getNodeAttr(node, "location");
    const nodeDivision = getNodeAttr(node, "division");
    const nodeCountry = getNodeAttr(node, "country");

    if (nodeLocation === state.location) {
      return state.location;
    } else if (nodeDivision === state.division) {
      return `Other counties in ${state.division}`;
    } else if (nodeCountry === state.country) {
      return `Other states in ${state.country}`;
    } else {
      return "Other countries";
    }
  };

  const allDates: Date[] = nodes.map((n: Node) => getNodeAttr(n, "num_date"));
  const minDate = Math.min(...allDates.map((d: Date) => d.getTime()));
  const maxDate = Math.max(...allDates.map((d: Date) => d.getTime()));
  const dateSpan = maxDate - minDate;

  let formatDate: Function;
  if (dateSpan > 7.884e9) {
    // more than 3mo total range
    formatDate = (date: Date) => {
      return timeFormat("%b %Y")(date);
    }; //
  } else {
    formatDate = (date: Date) => {
      return timeFormat("%b %Y")(date);
    }; // < 3 months - use Sunday-based week of the year per CDC calendar
  }

  const getDateBin = (node: Node) => {
    return formatDate(getNodeAttr(node, "num_date"));
  };

  // data wrangling
  let maxCount = 0;
  const dataPoints: { [key: string]: any } = {};
  nodes.forEach((n: Node) => {
    const nodeDate = getDateBin(n); //getNodeAttr(n, "num_date");
    if (!Object.keys(dataPoints).includes(nodeDate)) {
      dataPoints[nodeDate] = { dateBin: nodeDate };
      keys.forEach((k: string) => {
        dataPoints[nodeDate][k] = 0;
      });
    }
    const value =
      colorBy === "transmissions" ? getTransmissions(n) : getGeography(n);
    dataPoints[nodeDate][value] += 1;
    if (dataPoints[nodeDate][value] > maxCount) {
      maxCount = dataPoints[nodeDate][value];
    }
  });

  console.log("data points", dataPoints);

  // scales
  const dateScale = scaleBand<string>({
    domain: allDates,
    padding: 0.2,
  });

  const countScale = scaleLinear<number>({
    domain: [0, maxCount],
    nice: true,
  });

  const colorScale = scaleOrdinal<string>({
    domain: keys,
    range: [purple1, purple2, purple3],
  });

  let tooltipTimeout: number;

  if (chartSize.width < 10) return null;
  // bounds
  const xMax = chartSize.width;
  const yMax = chartSize.height - chartSize.margin - 100;

  dateScale.rangeRound([0, xMax]);
  countScale.range([yMax, 0]);

  return chartSize.width < 10 ? null : (
    <div style={{ position: "relative" }}>
      <svg width={chartSize.width} height={chartSize.height}>
        <rect
          x={0}
          y={0}
          width={chartSize.width}
          height={chartSize.height}
          fill={background}
          rx={14}
        />
        <Group top={chartSize.margin}>
          <BarStack
            data={Object.values(dataPoints)}
            keys={keys}
            x={(dp: any) => dp.dateBin}
            xScale={dateScale}
            yScale={countScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                  />
                ))
              )
            }
          </BarStack>
        </Group>
        <AxisBottom
          top={yMax + chartSize.margin}
          scale={dateScale}
          tickFormat={formatDate}
          stroke={purple3}
          tickStroke={purple3}
          tickLabelProps={() => ({
            fill: purple3,
            fontSize: 11,
            textAnchor: "middle",
          })}
        />
        <Grid
          top={chartSize.margin}
          left={chartSize.margin}
          xScale={dateScale}
          yScale={countScale}
          width={xMax}
          height={yMax}
          stroke="white"
          strokeOpacity={0.1}
          xOffset={dateScale.bandwidth() / 2}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: chartSize.margin / 2 - 10,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: "14px",
        }}
      >
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          labelMargin="0 15px 0 0"
        />
      </div>
    </div>
  );
};

export default EpiCurve;
