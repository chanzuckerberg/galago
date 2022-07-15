import * as d3 from "d3";
import { Label, Connector, CircleSubject, Annotation } from "@visx/annotation";
import { LinePath } from "@visx/shape";
import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import { BarStack } from "@visx/shape";
import { SeriesPoint } from "@visx/shape/lib/types";
import { Group } from "@visx/group";
import { GridRows } from "@visx/grid";
import { AxisBottom, AxisLeft } from "@visx/axis";
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
import { range, scaleTime } from "d3";
import {
  binMonthlyDate,
  binWeeklyDate,
  getDateRange,
  getTimepoints,
  sortDates,
} from "../../utils/dates";

type EpiCurveProps = {
  chartHeight: number;
  chartWidth: number;
  chartMargin: number;
};

export const EpiCurve = (props: EpiCurveProps) => {
  // STATE
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const [colorBy, setColorBy] = useState<"transmissions" | "geography">(
    "transmissions"
  );
  const { chartHeight, chartWidth, chartMargin } = props;

  const lightestGray = "rgba(220,220,220,1)";
  const mediumGray = "rgba(180,180,180,1)";
  const darkGray = "rgba(130,130,130,1)";
  const darkestGray = "rgba(80,80,80,1)";
  const steelblue = `rgba(70,130,180, 1)`;

  // DATES
  const samples = traverse_preorder(state.mrca)
    .filter((n: Node) => n.children.length === 0)
    .sort(
      (a, b) =>
        getNodeAttr(a, "num_date").getTime() -
        getNodeAttr(b, "num_date").getTime()
    );

  const allDates: Date[] = sortDates(
    samples.map((n: Node) => getNodeAttr(n, "num_date"))
  );
  const { minDate, maxDate, dateSpan } = getDateRange(allDates);
  const tmrca = getNodeAttr(state.mrca, "num_date");

  const binScale: "weekly" | "monthly" =
    dateSpan > 7.884e9 ? "monthly" : "weekly";

  const xLabel =
    binScale === "monthly"
      ? "Month of sample collection"
      : "Epi week of sample collection (Saturday end date)";

  const binDate = binScale === "monthly" ? binMonthlyDate : binWeeklyDate;

  const nodeToBinnedDate = (node: Node) => {
    return binDate(getNodeAttr(node, "num_date"));
  };

  let dateFormatString = binScale === "monthly" ? "%b" : "%b %d";

  const formatDate = (date: Date) => {
    return timeFormat(dateFormatString)(date);
  };

  let allDateBins: string[] = getTimepoints(tmrca, maxDate, binScale).map(
    (d: Date) => formatDate(d)
  );

  // ACCESSORS & COUNTS
  // leaving these here bc they requires lots of state
  const keys =
    colorBy === "transmissions"
      ? [
          "Identical to primary case",
          `Secondary / tertiary case (+1 - ${state.cladeDescription.muts_per_trans_minmax[1]} muts)`,
          `Tertiary+ case (${
            state.cladeDescription.muts_per_trans_minmax[1] + 1
          }+ muts)`,
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
      return keys[0];
    } else if (nMuts <= upper) {
      return keys[1];
    } else {
      return keys[2];
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
  samples.forEach((n: Node) => {
    const nodeDateBin = formatDate(nodeToBinnedDate(n));
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

  if (chartWidth < 10) return null;
  const xMax = chartWidth;
  const yMax = chartHeight - chartMargin - 100;

  dateScale.rangeRound([0, xMax]);
  countScale.range([yMax, 0]);

  let yTickValues = [];
  let gridValues = [];
  const countRange = range(maxCount + 1);
  if (maxCount < 40) {
    yTickValues = countRange.filter((t) => t % 5 === 0);
    gridValues = countRange;
  } else if (maxCount < 100) {
    yTickValues = countRange.filter((t) => t % 10 === 0);
    gridValues = countRange.filter((t) => t % 10 === 0);
  } else if (maxCount < 1000) {
    yTickValues = countRange.filter((t) => t % 100 === 0);
    gridValues = countRange.filter((t) => t % 100 === 0);
  } else {
    yTickValues = countRange.filter((t) => t % 500 === 0);
  }

  // PLOT
  return chartWidth < 10 ? null : (
    <div style={{ position: "relative", width: chartWidth }}>
      <svg width={chartWidth} height={chartHeight}>
        <Group top={chartMargin} left={chartMargin / 2}>
          <BarStack
            data={Object.values(dataPoints)}
            keys={keys}
            x={(dp: any) => dp.dateBin}
            xScale={dateScale}
            yScale={countScale}
            //@ts-ignore
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack, i) =>
                barStack.bars.map((bar, j) => {
                  return (
                    <rect
                      key={`bar-stack-${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={bar.y}
                      height={bar.height}
                      width={bar.width}
                      fill={bar.color}
                    />
                  );
                })
              )
            }
          </BarStack>
        </Group>
        <AxisBottom
          top={yMax + chartMargin}
          left={chartMargin / 2}
          scale={dateScale}
          //   tickFormat={formatDate}
          stroke={darkestGray}
          tickStroke={darkestGray}
          //   numTicks={15}
          //@ts-ignore
          tickLabelProps={() => ({
            fill: mediumGray,
            fontSize: 11,
            textAnchor: "middle",
          })}
          label={xLabel}
          //@ts-ignore
          labelProps={{
            fill: mediumGray,
            fontSize: 13,
            textAnchor: "middle",
          }}
        />
        <AxisLeft
          scale={countScale}
          hideAxisLine={true}
          hideZero={true}
          hideTicks={true}
          tickStroke={mediumGray}
          tickLabelProps={() => ({
            fill: mediumGray,
            fontSize: 10,
            textAnchor: "middle",
          })}
          left={chartMargin / 2}
          top={chartMargin}
          tickValues={yTickValues}
        />
        <GridRows
          top={chartMargin}
          left={chartMargin / 2}
          scale={countScale}
          width={xMax}
          height={yMax}
          stroke="white"
          strokeOpacity={1}
          tickValues={gridValues}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: chartMargin / 2 - 10,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: "11px",
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
