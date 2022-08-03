import { useState } from "react";
import { Node } from "../../d";
import { get_leaves, traverse_preorder } from "../../utils/treeMethods";
import { scaleLinear, extent, scaleTime, symbolCross } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { useSelector, useDispatch } from "react-redux";
//@ts-ignore
import uuid from "react-uuid";

type MutsDateScatterProps = {
  chartHeight: number;
  chartWidth: number;
  chartMargin: number;
};

export const MutsDateScatter = (props: MutsDateScatterProps) => {
  const { chartHeight, chartWidth, chartMargin } = props;
  const upperChartHeight = chartHeight;

  // LOCAL AND GLOBAL STATE
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);

  const dispatch = useDispatch();
  // DATA SETUP
  const allNodes = traverse_preorder(state.tree);
  const allSamples: Array<Node> = allNodes.filter(
    (n) => n.children.length === 0
  );
  allSamples.sort((sample1: Node, sample2: Node) => {
    return state.samplesOfInterestNames.includes(sample1.name) ? 1 : -1;
  });
  const mrcaNameToSampleNames = {};
  const allInternalNodes = allNodes.filter((n) => n.children.length >= 2);
  allInternalNodes.forEach(
    (n: Node) =>
      //@ts-ignore
      (mrcaNameToSampleNames[n.name] = get_leaves(n).map((l) => l.name))
  );

  /* colors in use */
  const lightestGray = "rgba(220,220,220,1)";
  const mediumGray = "rgba(180,180,180,1)";
  const darkGray = "rgba(130,130,130,1)";
  const darkestGray = "rgba(80,80,80,1)";
  const steelblue = `rgba(70,130,180, 1)`;

  // AXES
  const _xScaleTime = scaleTime()
    .domain(
      //@ts-ignore
      extent(allNodes, (node) => {
        return node.node_attrs.num_date.value;
      })
    )
    .range([chartMargin, chartWidth - chartMargin]);

  const _yMutsScale = scaleLinear()
    .domain(
      //@ts-ignore
      extent(allSamples, (sample) => {
        return sample.node_attrs.div;
      })
    )
    .range([upperChartHeight - chartMargin, chartMargin]);

  const plotBaseLayerSample = (sample: Node) => {
    return (
      <circle
        key={`baseLayerSample-${uuid()}`}
        cx={_xScaleTime(sample.node_attrs.num_date.value)}
        cy={_yMutsScale(sample.node_attrs.div)}
        r={2.5}
        style={{
          fill: lightestGray, //getMetadataColor(sample),
        }}
      />
    );
  };

  const plotBaseLayerSampleOfInterest = (sample: Node) => {
    return (
      <>
        <line
          x1="-4"
          y1="0"
          x2="4"
          y2="0"
          stroke={"black"} //getMetadataColor(sample)}
          strokeWidth={1}
          key={`baseLayerSampleOfInterest-${uuid()}`}
        />
        <line
          x1="0"
          y1="-4"
          x2="0"
          y2="4"
          stroke={"black"} //getMetadataColor(sample)}
          strokeWidth={1}
          key={`baseLayerSampleOfInterest-${uuid()}`}
        />
      </>
    );
  };

  const plotTopLayerSample = (sample: Node) => {
    return (
      <circle
        key={`topLayerSample-${uuid()}`}
        cx={_xScaleTime(sample.node_attrs.num_date.value)}
        cy={_yMutsScale(sample.node_attrs.div)}
        r={3}
        style={{
          fill: lightestGray, //getMetadataColor(sample),
          stroke: darkestGray, //getMetadataColor(sample),
          strokeWidth: 1,
        }}
      />
    );
  };

  const plotTopLayerSampleOfInterest = (sample: Node) => {
    return (
      <>
        <line
          x1="-6"
          y1="0"
          x2="6"
          y2="0"
          stroke={"black"} //getMetadataColor(sample)}
          strokeWidth={3}
          key={`topLayerSampleOfInterest-${uuid()}`}
        />
        <line
          x1="0"
          y1="-6"
          x2="0"
          y2="6"
          stroke={"black"} //getMetadataColor(sample)}
          strokeWidth={3}
          key={`topLayerSampleOfInterest-${uuid()}`}
        />
      </>
    );
  };

  return (
    <div>
      <svg width={chartWidth} height={upperChartHeight}>
        {allSamples.map((sample) => {
          const isSampleOfInterest = state.samplesOfInterestNames
            ? state.samplesOfInterestNames.includes(sample.name)
            : false;
          return isSampleOfInterest ? (
            <g
              transform={`translate(
                ${_xScaleTime(sample.node_attrs.num_date.value)},
                ${_yMutsScale(sample.node_attrs.div)}
              )`}
              key={`sampleOfInterestGroup-${uuid()}`}
            >
              {plotBaseLayerSampleOfInterest(sample)}
            </g>
          ) : (
            plotBaseLayerSample(sample)
          );
        })}
        {/* de-emphasis opacity layer to fade back all unselected nodes */}
        {hoverMRCA && (
          <rect
            width={chartWidth}
            height={upperChartHeight}
            fill={deemphasisLayerColor}
          />
        )}
        {/* plot all the samples that descend from the hovered MRCA again on top of the de-emphasis layer */}
        {allSamples.map((sample, i: number) => {
          const isHoverMrcaDescendent =
            hoverMRCA &&
            //@ts-ignore
            mrcaNameToSampleNames[hoverMRCA.name].includes(sample.name);

          if (!isHoverMrcaDescendent) return;

          const isSampleOfInterest = _samplesOfInterestNames
            ? _samplesOfInterestNames.includes(sample.name)
            : false;
          return isSampleOfInterest ? (
            <g
              transform={`translate(
                ${_xScaleTime(sample.node_attrs.num_date.value)},
                ${_yMutsScale(sample.node_attrs.div)}
              )`}
              key={`sampleOfInterestGroup-${uuid()}`}
            >
              {plotTopLayerSampleOfInterest(sample)}
            </g>
          ) : (
            plotTopLayerSample(sample)
          );
        })}
        <AxisLeft strokeWidth={0} left={chartMargin} scale={_yMutsScale} />
        <AxisBottom
          strokeWidth={0}
          top={upperChartHeight - chartMargin}
          scale={_xScaleTime}
          numTicks={9}
        />
        <text x="-150" y="45" transform="rotate(-90)" fontSize={14}>
          Mutations
        </text>
        <g
          id="interactive-sample-selection-legend"
          transform="translate(150,85)"
        >
          <circle cx="0" cy="7" r={3} fill={mediumGray} />
          <text x="10" y="10" fontSize={14}>
            Samples
          </text>
          <g transform={`translate(0,26.5)`}>
            <line x1="-4" y1="0" x2="4" y2="0" stroke="black" strokeWidth={1} />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="black" strokeWidth={1} />
          </g>
          <text x="10" y="30" fontSize={14}>
            Your samples of interest
          </text>
          <circle
            cx="0"
            cy="47"
            r={3}
            fill={"rgb(240,240,240)"}
            stroke={darkGray}
          />
          <text x="10" y="50" fontSize={14}>
            Samples in hovered cluster
          </text>
          <g transform={`translate(0,66.5)`}>
            <line x1="-4" y1="0" x2="4" y2="0" stroke="black" strokeWidth={2} />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="black" strokeWidth={2} />
          </g>
          <text x="10" y="70" fontSize={14}>
            Your samples of interest in hovered cluster
          </text>
        </g>
      </svg>
    </div>
  );
};

export default MutsDateScatter;
