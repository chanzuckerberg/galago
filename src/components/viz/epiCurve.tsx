import { useSelector } from "react-redux";
import React, { useState } from "react";
import { BarStack } from "@visx/shape";
import { Group } from "@visx/group";
import { GridRows } from "@visx/grid";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { timeFormat } from "d3-time-format";
// import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { LegendOrdinal } from "@visx/legend";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TimelineIcon from "@mui/icons-material/Timeline";
import MapIcon from "@mui/icons-material/Map";
import {
  getNodeAttr,
  get_dist,
  traverse_preorder,
} from "../../utils/treeMethods";
import { Node } from "../../d";
import { range } from "d3";
import {
  binMonthlyDate,
  binWeeklyDate,
  getDateRange,
  getTimepoints,
  sortDates,
} from "../../utils/dates";
import { Theme } from "../../theme";

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

  let dateFormatString = binScale === "monthly" ? "%y-%m" : "%y-%m-%d";

  const formatDate = (date: Date) => {
    return timeFormat(dateFormatString)(date);
  };

  let allDateBins: string[] = getTimepoints(
    tmrca ? tmrca : minDate,
    maxDate,
    binScale
  ).map((d: Date) => formatDate(d));

  // ACCESSORS & COUNTS
  // leaving these here bc they requires lots of state
  const keys =
    colorBy === "transmissions"
      ? [
          "Identical to primary case",
          `Secondary / tertiary case (+1 - ${
            state.mutsPerTransmissionMax * 2
          } muts)`,
          `Tertiary+ case (${state.mutsPerTransmissionMax * 2 + 1}+ muts)`,
        ]
      : [
          state.location,
          `Other counties in ${state.division}`,
          `Other states in ${state.country}`,
          "Other countries",
        ];

  const getTransmissions = (node: Node) => {
    const nMuts = get_dist([node, state.mrca]);
    const threshold = state.mutsPerTransmissionMax;
    if (nMuts === 0) {
      return keys[0];
    } else if (nMuts <= threshold * 2) {
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
    range: [
      Theme.palette.primary.main,
      Theme.palette.primary.light,
      //@ts-ignore
      Theme.palette.primary.lighter,
      Theme.palette.secondary.light,
    ],
  });

  if (chartWidth < 10) return null;
  const xMax = chartWidth;
  const yMax = chartHeight - chartMargin - 100;

  dateScale.rangeRound([0, xMax]);
  countScale.range([yMax, 0]);

  let xTickValues = Array.from(allDateBins);
  xTickValues[0] = xTickValues[0] + "*";
  let yTickValues = [];
  let gridValues: number[] = [];
  const countRange = range(maxCount + 1);
  if (maxCount < 5) {
    yTickValues = countRange;
    gridValues = countRange;
  } else if (maxCount < 30) {
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

  const handleColorbySelection = (
    event: React.MouseEvent<HTMLElement>,
    newValue: "transmissions" | "geography" | null
  ) => {
    if (newValue !== null) {
      setColorBy(newValue);
    }
  };

  // PLOT
  return chartWidth < 10 ? null : (
    <div
      style={{
        position: "relative",
        width: chartWidth,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: chartWidth,
        }}
      >
        <div style={{ width: 60 }}>
          <ToggleButtonGroup
            value={colorBy}
            exclusive
            onChange={handleColorbySelection}
            aria-label="color by"
          >
            <ToggleButton
              value="transmissions"
              aria-label="transmissions"
              style={{ width: 30, height: 30 }}
            >
              <TimelineIcon />
            </ToggleButton>
            <ToggleButton
              value="geography"
              aria-label="geography"
              style={{ width: 30, height: 30 }}
            >
              <MapIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div
          style={{
            fontSize: "11px",
            width: chartWidth - 80,
            position: "relative",
          }}
        >
          <LegendOrdinal scale={colorScale} direction="row" />
        </div>
      </div>

      <svg width={chartWidth + chartMargin} height={chartHeight - 50}>
        {/* BUG / hack solution - SVG height is overly tall, but decreasing svg height squishes the actual elements in it */}
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
          stroke={Theme.palette.secondary.main}
          tickStroke={Theme.palette.secondary.main}
          tickValues={allDateBins}
          //@ts-ignore
          tickLabelProps={(tickLabel: string) => {
            if (tickLabel === allDateBins[0] && tmrca) {
              return {
                fill: Theme.palette.primary.main,
                fontSize: 12,
                fontWeight: "bold",
                textAnchor: "middle",
              };
            } else {
              return {
                fill: Theme.palette.secondary.main,
                fontSize: 11,
                textAnchor: "middle",
              };
            }
          }}
          label={xLabel}
          //@ts-ignore
          labelProps={{
            fill: Theme.palette.secondary.main,
            fontSize: 13,
            textAnchor: "middle",
          }}
        />
        <AxisLeft
          scale={countScale}
          hideAxisLine={true}
          hideZero={true}
          hideTicks={true}
          tickStroke={Theme.palette.secondary.main}
          tickLabelProps={() => ({
            fill: Theme.palette.secondary.main,
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
          stroke={"white"}
          strokeOpacity={1}
          tickValues={gridValues}
        />
      </svg>
    </div>
  );
};

export default EpiCurve;
