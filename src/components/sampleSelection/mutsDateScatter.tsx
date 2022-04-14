import React, { useState } from "react";
import { Node } from "../../d";
import { get_leaves, traverse_preorder } from "../../utils/treeMethods";
import { scaleLinear, extent, scaleTime, symbolCross } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { useSelector, useDispatch } from "react-redux";

function MutsDateScatter() {
  // LOCAL AND GLOBAL STATE
  const [hoverMRCA, sethoverMRCA] = useState<Node | null>(null);
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  // DATA SETUP
  const _samplesOfInterestNames = state.samplesOfInterest.map((n) => n.name);
  const allNodes = traverse_preorder(state.tree);
  const allSamples: Array<Node> = allNodes.filter(
    (n) => n.children.length === 0
  );
  allSamples.sort((sample1: Node, sample2: Node) => {
    return _samplesOfInterestNames.includes(sample1.name) ? 1 : -1;
  });
  const mrcaNameToSampleNames = {};
  const allInternalNodes = allNodes.filter((n) => n.children.length >= 2);
  allInternalNodes.forEach(
    (n: Node) =>
      //@ts-ignore
      (mrcaNameToSampleNames[n.name] = get_leaves(n).map((l) => l.name))
  );

  // FORMATTING VARIABLES
  const chartSize = 560;
  const chartWidth = 960;
  const margin = 30;

  /* colors in use */
  const lightestGray = "rgba(220,220,220,1)";
  const mediumGray = "rgba(180,180,180,1)";
  const darkGray = "rgba(130,130,130,1)";
  const darkestGray = "rgba(80,80,80,1)";
  const steelblue = `rgba(70,130,180, 1)`;

  /* deemphasis */
  const deemphasisLayerColor = `rgba(255,255,255,0.4)`;

  /*
    mrca hover interface to help users see distribution of 
    mrcas that have all samples of interest 
    thinking tool
  // */
  // const defaultMrcaStroke = null;
  // const defaultMrcaFill = null;
  // const mrcaContainsAllSamplesOfInterestFill = null; /* filled in */
  // const mrcaContainsAllSamplesOfInterestStroke = null; /* filled in */

  // AXES
  const _xScaleTime = scaleTime()
    .domain(
      //@ts-ignore
      extent(allNodes, (node) => {
        return node.node_attrs.num_date.value;
      })
    )
    .range([margin, chartWidth - margin]);

  const _yMutsScale = scaleLinear()
    .domain(
      //@ts-ignore
      extent(allSamples, (sample) => {
        return sample.node_attrs.div;
      })
    )
    .range([chartSize - margin, margin]);

  // const getMetadataColor = (
  //   sample: Node,
  //   fields: string[] = ["location", "division"], // hierarchically search for a match
  //   valuesToMatch: string[] = [state.location, state.division], // first check if `location.value` is a match to state.location
  //   cmap = {
  //     location: steelblue, // if it is, use the `location` color
  //     division: "lightsteelblue", // if `location` doesn't match but `division` does, use `division` color
  //     other: mediumGray, // default
  //   }
  // ) => {
  //   for (let i = 0; i < fields.length; i++) {
  //     let field = fields[i];
  //     let valueToMatch = valuesToMatch[i];
  //     if (sample.node_attrs[field]["value"] === valueToMatch) {
  //       const color = Object.keys(cmap).includes(field)
  //         ? cmap[field]
  //         : cmap["other"];
  //       return color;
  //     }
  //   }
  //   return cmap["other"];
  // };

  const plotBaseLayerSample = (sample: Node, i: number) => {
    return (
      <circle
        key={i}
        cx={_xScaleTime(sample.node_attrs.num_date.value)}
        cy={_yMutsScale(sample.node_attrs.div)}
        r={2.5}
        style={{
          fill: lightestGray, //getMetadataColor(sample),
        }}
      />
    );
  };

  const plotBaseLayerSampleOfInterest = (sample: Node, i: number) => {
    return (
      <>
        <line
          x1="-4"
          y1="0"
          x2="4"
          y2="0"
          stroke={"black"} //getMetadataColor(sample)}
          strokeWidth={1}
          key={i}
        />
        <line
          x1="0"
          y1="-4"
          x2="0"
          y2="4"
          stroke={"black"} //getMetadataColor(sample)}
          strokeWidth={1}
          key={i + 0.5}
        />
      </>
    );
  };

  const plotTopLayerSample = (sample: Node, i: number) => {
    return (
      <circle
        key={i}
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

  const plotTopLayerSampleOfInterest = (sample: Node, i: number) => {
    return (
      <>
        <line
          x1="-6"
          y1="0"
          x2="6"
          y2="0"
          stroke={"black"} //getMetadataColor(sample)}
          strokeWidth={3}
          key={i}
        />
        <line
          x1="0"
          y1="-6"
          x2="0"
          y2="6"
          stroke={"black"} //getMetadataColor(sample)}
          strokeWidth={3}
          key={i + 0.5}
        />
      </>
    );
  };

  return (
    <div>
      <svg width={chartWidth} height={chartSize}>
        {allSamples.map((sample, i: number) => {
          const isSampleOfInterest = _samplesOfInterestNames
            ? _samplesOfInterestNames.includes(sample.name)
            : false;
          return isSampleOfInterest ? (
            <g
              transform={`translate(
                ${_xScaleTime(sample.node_attrs.num_date.value)},
                ${_yMutsScale(sample.node_attrs.div)}
              )`}
            >
              {plotBaseLayerSampleOfInterest(sample, i)}
            </g>
          ) : (
            plotBaseLayerSample(sample, i)
          );
        })}
        {/* de-emphasis opacity layer to fade back all unselected nodes */}
        {hoverMRCA && (
          <rect
            width={chartWidth}
            height={chartSize}
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
            >
              {plotTopLayerSampleOfInterest(sample, i)}
            </g>
          ) : (
            plotTopLayerSample(sample, i)
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
          <circle cx="0" cy="7" r={3} fill={mediumGray} />
          <text x="10" y="10" fontSize={10}>
            Samples
          </text>
          <g transform={`translate(0,26.5)`}>
            <line x1="-4" y1="0" x2="4" y2="0" stroke="black" strokeWidth={1} />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="black" strokeWidth={1} />
          </g>
          <text x="10" y="30" fontSize={10}>
            Your samples of interest
          </text>
          <circle
            cx="0"
            cy="47"
            r={3}
            fill={"rgb(240,240,240)"}
            stroke={darkGray}
          />
          <text x="10" y="50" fontSize={10}>
            Samples in hovered cluster
          </text>
          <g transform={`translate(0,66.5)`}>
            <line x1="-4" y1="0" x2="4" y2="0" stroke="black" strokeWidth={2} />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="black" strokeWidth={2} />
          </g>
          <text x="10" y="70" fontSize={10}>
            Your samples of interest in hovered cluster
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
                dispatch({ type: "mrca clicked", data: node });
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
          <text x={chartWidth / 2 - 180} y={40} fontSize={10}>
            {hoverMRCA
              ? `Selected cluster's primary case date: ${hoverMRCA.node_attrs.num_date.value
                  .toISOString()
                  .substring(0, 10)}. ${
                  get_leaves(hoverMRCA).length
                } total samples.`
              : `Clusters, sorted by the date of the inferred primary case (hover to select a cluster).`}
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
