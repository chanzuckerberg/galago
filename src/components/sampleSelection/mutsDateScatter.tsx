import React, { useState } from "react";
import { Node } from "../../d";
import { get_dist, get_leaves, get_root } from "../../utils/treeMethods";

import { scaleLinear, scaleBand, extent, scaleTime, rgb } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";

interface mutsDateScatterProps {
  tree: Node;
  mrca: any;
  setMRCA: Function;
  mrcaOptions: internalNodeDataType[];
  selectedSampleNames: string[];
}

type sampleDataType = { name: string; date: Date; muts: number; raw: Node };
type internalNodeDataType = {
  name: string;
  date: Date;
  samples: string[];
  raw: Node;
};

function MutsDateScatter(props: mutsDateScatterProps) {
  const { tree, setMRCA, mrca, mrcaOptions, selectedSampleNames } = props;
  const [hoverMRCA, sethoverMRCA] = useState<internalNodeDataType | null>(null);

  const root = get_root(tree);

  // Catalog all samples in the tree --> // [{name, date, muts from root}]
  const all_samples: Array<Node> = get_leaves(tree);
  let sample_data: sampleDataType[] = [];
  all_samples.forEach((sample: Node) => {
    sample_data.push({
      name: sample.name,
      date: sample.node_attrs.num_date.value,
      muts: get_dist([root, sample]),
      raw: sample, // location data is in raw > node_attrs > location/division > value
    });
  });

  const chartSize = 560;
  const chartWidth = 960;
  const margin = 30;
  const defaultSampleCircleRadius = 3;

  /* colors in use */
  const lightestGray = "rgba(220,220,220,1)";
  const mediumGray = "rgba(180,180,180,1)";
  const darkGray = "rgba(130,130,130,1)";
  const darkestGray = "rgba(80,80,80,1)";
  const steelblue = `rgba(70,130,180, 1)`;

  /* base layer  */
  const baseLayerGrayColor = lightestGray;
  const maximumEmphasisColor = "rgba(0,0,0, 1)";

  /* deemphasis */
  const deemphasis = 0.4;
  const deemphasisLayer = `rgba(255,255,255,${deemphasis})`;
  const radiusSampleDeemphasis = 2;

  /* samples, mrcaHovered */

  const isMrcaHoveredStroke = darkGray;
  const isMrcaHoveredFill = "none";

  const isSampleOfInterestColor = maximumEmphasisColor;
  const isSampleOfInterestMrcaHoveredStroke = maximumEmphasisColor;
  const isSampleOfInterestMrcaHoveredFill = maximumEmphasisColor;

  const isSampleOfInterestMrcaHoveredStrokeWidth = 3;

  /*
    mrca hover interface to help users see distribution of 
    mrcas that have all samples of interest 
    thinking tool
  */
  const defaultMrcaStroke = null;
  const defaultMrcaFill = null;
  const mrcaContainsAllSamplesOfInterestFill = null; /* filled in */
  const mrcaContainsAllSamplesOfInterestStroke = null; /* filled in */

  const _xScaleTime = scaleTime()
    .domain(
      //@ts-ignore
      extent(sample_data, (sample) => {
        return sample.date;
      })
    )
    .range([margin, chartWidth - margin]);

  const _yMutsScale = scaleLinear()
    .domain(
      //@ts-ignore
      extent(sample_data, (sample) => {
        return sample.muts;
      })
    )
    .range([chartSize - margin, margin]);

  const getSampleCircleRadius = (isSelected: boolean, isBaseLayer: boolean) => {
    let sampleCircleRadius = defaultSampleCircleRadius;

    if (isSelected) {
      sampleCircleRadius = isSampleOfInterestMrcaHoveredStrokeWidth;
    }

    if (isBaseLayer && !isSelected) {
      return radiusSampleDeemphasis;
    }

    return sampleCircleRadius;
  };

  const getHoverMrcaStyle = (isSelected: boolean) => {
    let fill: string = isMrcaHoveredFill;
    let stroke: string = isMrcaHoveredStroke;
    let strokeWidth: number = 1;

    if (isSelected) {
      fill = isSampleOfInterestMrcaHoveredFill;
      stroke = isSampleOfInterestMrcaHoveredStroke;
      strokeWidth = 3;
    }

    return {
      fill,
      stroke,
      strokeWidth,
    };
  };

  return (
    <div>
      <svg width={chartWidth} height={chartSize}>
        {sample_data.map((sample, i: number) => {
          // "selected" here means typed into input (will rename all this state at some rate)
          const isSelected = selectedSampleNames.includes(sample.name);
          const isBaseLayer = true;
          return (
            <circle
              key={i}
              cx={_xScaleTime(sample.date)}
              cy={_yMutsScale(sample.muts)}
              r={getSampleCircleRadius(isSelected, isBaseLayer)}
              style={{
                fill: isSelected ? isSampleOfInterestColor : baseLayerGrayColor,
              }}
            />
          );
        })}
        {/* opacity layer to fade back all unselected nodes */}
        {hoverMRCA && (
          <rect width={chartWidth} height={chartSize} fill={deemphasisLayer} />
        )}
        {sample_data.map((sample, i: number) => {
          const isHoverMrcaDescendent =
            hoverMRCA &&
            //@ts-ignore
            mrcaOptions
              .find((n) => n.name === hoverMRCA.name)
              .samples.includes(sample.name);

          if (!isHoverMrcaDescendent) return;

          // "selected" here means typed into input (will rename all this state at some rate)
          const isSelected = selectedSampleNames.includes(sample.name);
          return (
            <circle
              key={i}
              cx={_xScaleTime(sample.date)}
              cy={_yMutsScale(sample.muts)}
              r={getSampleCircleRadius(isSelected)}
              style={getHoverMrcaStyle(isSelected)}
            />
          );
        })}
        <AxisLeft strokeWidth={0} left={margin} scale={_yMutsScale} />
        <AxisBottom
          strokeWidth={0}
          top={chartSize - margin}
          scale={_xScaleTime}
          numTicks={9}
        />
        <text x="-150" y="45" transform="rotate(-90)" fontSize={10}>
          Mutations
        </text>
      </svg>
      <svg
        width={chartWidth}
        height={100}
        onMouseLeave={() => {
          if (
            !hoverMRCA ||
            hoverMRCA.name !== mrca.name ||
            !mrcaOptions.includes(hoverMRCA)
          ) {
            sethoverMRCA(null);
          }
        }}
      >
        {mrcaOptions.map((node: any, i: number) => {
          return (
            <circle
              key={i}
              onMouseEnter={() => {
                sethoverMRCA(node);
              }}
              onClick={() => {
                setMRCA(node.raw);
              }}
              cx={_xScaleTime(node.date)}
              cy={10}
              r={hoverMRCA && hoverMRCA.name === node.name ? 6 : 3}
              style={{
                fill:
                  hoverMRCA && hoverMRCA.name === node.name
                    ? steelblue
                    : `none`,
                stroke:
                  hoverMRCA && hoverMRCA.name === node.name
                    ? steelblue
                    : mediumGray,
              }}
            />
          );
        })}
        <g>
          {/* <text x={margin - 4} y={20} fontSize={10}> */}
          <text x={chartWidth / 2 - 110} y={40} fontSize={10}>
            {hoverMRCA
              ? `Selected primary case date: ${hoverMRCA.date
                  .toISOString()
                  .substring(0, 10)}. ${
                  hoverMRCA.samples.length
                } descendent samples.`
              : `Inferred 'primary cases' (hover to select a case).`}
          </text>
          <text x={margin} y={40} fontSize={10} fontStyle="italic">
            broader selection
          </text>
          <text
            x={chartWidth - margin - 90}
            y={40}
            fontSize={10}
            fontStyle="italic"
          >
            narrower selection
          </text>
        </g>
      </svg>
    </div>
  );
}

export default MutsDateScatter;
