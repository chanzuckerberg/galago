import { forceNode, forceLink, Node } from "../../../d";
import * as d3 from "d3";
import { SimulationNodeDatum } from "d3";
//@ts-ignore
import uuid from "react-uuid";
import { useSelector } from "react-redux";

type DrawNodesProps = {
  forceNodes: forceNode[];
  colorScale: [string, string, string];
  chartWidth: number;
  chartHeight: number;
  chartMargin: number;
  scaleDomainX: [number, number];
  scaleDomainY: [number, number];
};

const outlineColor = "black"; //"rgba(80,80,80,1)";

const getColor = (
  forceNode: forceNode,
  muts_per_trans_minmax: number[],
  colorScale: [string, string, string]
) => {
  //@ts-ignore -- not sure why the `extend` works for forceLink but not forceNode in d.ts
  if (forceNode.mrcaDist === 0) {
    return colorScale[0];
    //@ts-ignore
  } else if (
    //@ts-ignore
    forceNode.mrcaDist <=
    muts_per_trans_minmax[1] * 2
  ) {
    return colorScale[1];
  } else {
    return colorScale[2];
  }
};

const drawCircle = (
  forceNode: forceNode,
  muts_per_trans_minmax: number[],
  colorScale: [string, string, string],
  radius: number,
  scaleX: Function,
  scaleY: Function
) => {
  const color = getColor(forceNode, muts_per_trans_minmax, colorScale);
  return (
    <circle
      onClick={() => {}}
      className="node"
      cx={scaleX(forceNode.x)}
      cy={scaleY(forceNode.y)}
      r={radius}
      fill={color}
      key={`node-${uuid()}`}
      opacity={0.95}
      stroke={outlineColor}
    ></circle>
  );
};

const drawSquare = (
  forceNode: forceNode,
  muts_per_trans_minmax: number[],
  colorScale: [string, string, string],
  radius: number,
  scaleX: Function,
  scaleY: Function
) => {
  const color = getColor(forceNode, muts_per_trans_minmax, colorScale);
  return (
    <rect
      onClick={() => {}}
      className="node"
      x={scaleX(forceNode.x ? forceNode.x - radius * Math.cos(45) : NaN)}
      y={scaleY(forceNode.y ? forceNode.y - radius * Math.cos(45) : NaN)}
      width={2 * radius * 0.8}
      height={2 * radius * 0.8}
      fill={color}
      key={`node-${uuid()}`}
      stroke={outlineColor}
      opacity={0.95}
    ></rect>
  );
};

export const DrawNodes = (props: DrawNodesProps) => {
  const {
    forceNodes,
    colorScale,
    chartWidth,
    chartHeight,
    chartMargin,
    scaleDomainX,
    scaleDomainY,
  } = props;

  const radius = Math.max(
    Math.min(chartHeight / (0.8 * forceNodes.length), 25),
    2
  );

  const scaleX = d3
    .scaleLinear()
    .domain(scaleDomainX)
    .range([chartMargin, chartWidth - chartMargin]);

  const scaleY = d3
    .scaleLinear()
    .domain(scaleDomainY)
    .range([chartMargin, chartHeight - chartMargin]);

  // @ts-ignore
  const state = useSelector((state) => state.global);

  return (
    <g className="nodes">
      {forceNodes.map((forceNode: SimulationNodeDatum) => {
        //@ts-ignore
        if (!forceNode.isLeaf) {
          return <></>;
        }

        //@ts-ignore
        if (state.samplesOfInterestNames.includes(forceNode.id)) {
          return drawSquare(
            //@ts-ignore
            forceNode,
            state.mutsPerTransmissionMax,
            colorScale,
            radius,
            scaleX,
            scaleY
          );
        } else {
          return drawCircle(
            //@ts-ignore
            forceNode,
            state.mutsPerTransmissionMax,
            colorScale,
            radius,
            scaleX,
            scaleY
          );
        }
      })}
    </g>
  );
};

export default DrawNodes;
