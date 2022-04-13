import React, { useState } from "react";
import { Node } from "../../d";
import { get_dist, get_leaves, get_root } from "../../utils/treeMethods";
import { scaleLinear, extent, scaleTime, symbolCross } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { useSelector, useDispatch } from "react-redux";

function MutsDateScatter() {
  const [hoverMRCA, sethoverMRCA] = useState<Node | null>(null);
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  // Catalog all samples in the tree --> // [{name, date, muts from root}]
  const all_samples: Array<Node> = get_leaves(state.tree);

  // all_samples.sort((sample1: string, sample2: string) => {
  //   return state.samplesOfInterestNames.includes(sample1.name) ? 1 : -1
  // }

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
  const radiusSampleDeemphasis = 3;

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
      extent(all_samples, (sample) => {
        return sample.node_attrs.num_date.value;
      })
    )
    .range([margin, chartWidth - margin]);

  const _yMutsScale = scaleLinear()
    .domain(
      //@ts-ignore
      extent(all_samples, (sample) => {
        return sample.node_attrs.div;
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

  const getBaseLayerSampleColor = (
    isSelected: boolean,
    selectedLocation: string,
    sampleLocation: string
  ) => {
    let _sampleColor = baseLayerGrayColor;

    if (isSelected) {
      _sampleColor = isSampleOfInterestColor;
    }

    /* if it's a sample of interest AND your selected location ... */
    if (selectedLocation === sampleLocation && isSelected) {
      _sampleColor = steelblue;
    }

    return _sampleColor;
  };

  return (
    <div>
      <svg width={chartWidth} height={chartSize}>
        {all_samples.map((sample, i: number) => {
          // "selected" here means typed into input (will rename all this state at some rate)
          const isSelected = state.samplesOfInterestNames
            ? state.samplesOfInterestNames.includes(sample.name)
            : false;
          const isBaseLayer = true;
          const selectedLocation = "Humboldt County";
          return isSelected ? (
            <g
              transform={`translate(
                ${_xScaleTime(sample.node_attrs.num_date.value)},
                ${_yMutsScale(sample.node_attrs.div)}
              )`}
            >
              <line
                x1="-4"
                y1="0"
                x2="4"
                y2="0"
                stroke="black"
                strokeWidth={1}
              />
              <line
                x1="0"
                y1="-4"
                x2="0"
                y2="4"
                stroke="black"
                strokeWidth={1}
              />
            </g>
          ) : (
            <circle
              key={i}
              cx={_xScaleTime(sample.node_attrs.num_date.value)}
              cy={_yMutsScale(sample.node_attrs.div)}
              r={getSampleCircleRadius(isSelected, isBaseLayer)}
              style={{
                fill: getBaseLayerSampleColor(
                  isSelected,
                  selectedLocation,
                  sample.node_attrs.location.value
                ),
              }}
            />
          );
        })}
        {/* opacity layer to fade back all unselected nodes */}
        {hoverMRCA && (
          <rect width={chartWidth} height={chartSize} fill={deemphasisLayer} />
        )}
        {all_samples.map((sample, i: number) => {
          const isHoverMrcaDescendent =
            hoverMRCA &&
            state.mrca &&
            get_leaves(
              state.mrcaOptions.find((n: Node) => n.name === hoverMRCA.name)
            )
              .map((n: Node) => n.name)
              .includes(sample.name);

          if (!isHoverMrcaDescendent) return;

          // "selected" here means typed into input (will rename all this state at some rate)
          const isSelected = state.samplesOfInterestNames
            ? state.samplesOfInterestNames.includes(sample.name)
            : false;
          return (
            <circle
              key={i}
              cx={_xScaleTime(sample.node_attrs.num_date.value)}
              cy={_yMutsScale(sample.node_attrs.div)}
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
        <g
          id="interactive-sample-selection-legend"
          transform="translate(150,85)"
        >
          <circle cx="0" cy="7" r={radiusSampleDeemphasis} fill={mediumGray} />
          <text x="10" y="10" fontSize={10}>
            Sample
          </text>
          <g transform={`translate(0,26.5)`}>
            <line x1="-4" y1="0" x2="4" y2="0" stroke="black" strokeWidth={1} />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="black" strokeWidth={1} />
          </g>
          <text x="10" y="30" fontSize={10}>
            Manually entered samples of interest
          </text>
          <circle
            cx="0"
            cy="47"
            r={3}
            fill={"rgb(240,240,240)"}
            stroke={darkGray}
          />
          <text x="10" y="50" fontSize={10}>
            Samples descended from currently hovered MRCA
          </text>
          <g transform={`translate(0,66.5)`}>
            <line x1="-4" y1="0" x2="4" y2="0" stroke="black" strokeWidth={2} />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="black" strokeWidth={2} />
          </g>
          <text x="10" y="70" fontSize={10}>
            Manually entered samples of interest descended from hovered MRCA
          </text>
        </g>
      </svg>
      <svg
        width={chartWidth}
        height={45}
        onMouseLeave={() => {
          if (
            !hoverMRCA ||
            hoverMRCA.name !== state.mrca.name ||
            !state.mrcaOptions.includes(hoverMRCA)
          ) {
            sethoverMRCA(null);
          }
        }}
      >
        {state.mrcaOptions.map((node: any, i: number) => {
          return (
            <circle
              key={i}
              onMouseEnter={() => {
                sethoverMRCA(node);
              }}
              onClick={() => {
                setMRCA(node);
              }}
              cx={_xScaleTime(node.node_attrs.num_date.value)}
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
              ? `Selected primary case date: ${hoverMRCA.node_attrs.num_date.value
                  .toISOString()
                  .substring(0, 10)}. ${
                  get_leaves(hoverMRCA).length
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
