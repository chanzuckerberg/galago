import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import { BarStack } from "@visx/shape";
import { SeriesPoint } from "@visx/shape/lib/types";
import { Group } from "@visx/group";
import { GridRows } from "@visx/grid";
import { AxisBottom } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { timeParse, timeFormat } from "d3-time-format";
// import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { LegendOrdinal } from "@visx/legend";
import {
  getNodeAttr,
  get_dist,
  traverse_preorder,
} from "../../utils/treeMethods";
import { Node } from "../../d";
import { scaleTime } from "d3";

export const EpiCurve = () => {
  // STATE
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const [colorBy, setColorBy] = useState<"transmissions" | "geography">(
    "transmissions"
  );

  // STYLING
  const chartSize = {
    height: 350,
    width: 600,
    margin: 30,
  };
  const lightestGray = "rgba(220,220,220,1)";
  const mediumGray = "rgba(180,180,180,1)";
  const darkGray = "rgba(130,130,130,1)";
  const darkestGray = "rgba(80,80,80,1)";
  const steelblue = `rgba(70,130,180, 1)`;

  // DATES
  const nodes = traverse_preorder(state.mrca);

  const allDates: Date[] = nodes
    .map((n: Node) => getNodeAttr(n, "num_date"))
    .sort((a, b) => a.getTime() - b.getTime());

  const dateSpan = allDates.slice(-1)[0].getTime() - allDates[0].getTime();
  let formatDate: Function;
  let xLabel: string;
  if (dateSpan > 7.884e9) {
    // more than 3mo total range
    xLabel = "Month of sample collection";
    formatDate = (date: Date) => {
      return timeFormat("%b %Y")(date);
    };
  } else {
    xLabel = "Epi week of sample collection";
    formatDate = (date: Date) => {
      return timeFormat("%U %Y")(date);
    }; // < 3 months - use Sunday-based week of the year per CDC calendar
  }

  const getDateBin = (node: Node) => {
    return formatDate(getNodeAttr(node, "num_date"));
  };

  const allDateBins: string[] = allDates.map((date: Date) => formatDate(date));

  // ACCESSORS & COUNTS
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

  // DATA WRANGLING
  const dataPoints: { [key: string]: any } = {};
  nodes.forEach((n: Node) => {
    const nodeDateBin = getDateBin(n); //getNodeAttr(n, "num_date");
    if (!Object.keys(dataPoints).includes(nodeDateBin)) {
      dataPoints[nodeDateBin] = { dateBin: nodeDateBin };
      keys.forEach((k: string) => {
        dataPoints[nodeDateBin][k] = 0;
      });
    }
    const value =
      colorBy === "transmissions" ? getTransmissions(n) : getGeography(n);
    dataPoints[nodeDateBin][value] += 1;
  });

  let maxCount = 0;
  Object.values(dataPoints).forEach((dp) => {
    let thisTotal: number = 0;
    keys.forEach((k) => {
      thisTotal += dp[k];
    });
    if (thisTotal > maxCount) {
      maxCount = thisTotal;
    }
  });
  maxCount += 1;

  // SCALES & AXES
  const dateScale = scaleBand<string>({
    domain: allDateBins,
    padding: 0.2,
  });

  const countScale = scaleLinear<number>({
    domain: [0, maxCount],
    nice: true,
  });

  const colorScale = scaleOrdinal<string>({
    domain: keys,
    range: [darkestGray, mediumGray, lightestGray],
  });

  if (chartSize.width < 10) return null;
  const xMax = chartSize.width;
  const yMax = chartSize.height - chartSize.margin - 100;

  dateScale.rangeRound([0, xMax]);
  countScale.range([yMax, 0]);

  // PLOT
  return chartSize.width < 10 ? null : (
    <div style={{ position: "relative", width: chartSize.width }}>
      <svg width={chartSize.width} height={chartSize.height}>
        {/* <rect
          x={0}
          y={0}
          width={chartSize.width}
          height={chartSize.height}
          fill={background}
          rx={14}
        /> */}
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
          //   tickFormat={formatDate}
          stroke={darkestGray}
          tickStroke={darkestGray}
          //   numTicks={15}
          tickLabelProps={() => ({
            fill: { mediumGray },
            fontSize: 11,
            textAnchor: "middle",
          })}
          label={xLabel}
          labelProps={{
            fill: { mediumGray },
            fontSize: 13,
            textAnchor: "middle",
          }}
        />
        <GridRows
          top={chartSize.margin}
          //   left={chartSize.margin}
          scale={countScale}
          width={xMax}
          height={yMax}
          stroke="white"
          strokeOpacity={1}
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
