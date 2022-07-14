import { forceNode, forceLink, Node } from "../../../d";

import { SimulationNodeDatum } from "d3";
//@ts-ignore
import uuid from "react-uuid";
import { useSelector } from "react-redux";

type DrawNodesProps = {
  forceNodes: forceNode[];
  colorScale: [string, string, string];
  chartHeight: number;
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
  radius: number
) => {
  const color = getColor(forceNode, muts_per_trans_minmax, colorScale);
  return (
    <circle
      onClick={() => {}}
      className="node"
      cx={forceNode.x}
      cy={forceNode.y}
      r={10}
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
  radius: number
) => {
  const color = getColor(forceNode, muts_per_trans_minmax, colorScale);
  return (
    <rect
      onClick={() => {}}
      className="node"
      x={forceNode.x ? forceNode.x - radius * Math.cos(45) : NaN}
      y={forceNode.y ? forceNode.y - radius * Math.cos(45) : NaN}
      width={2 * radius * Math.cos(45)}
      height={2 * radius * Math.cos(45)}
      fill={color}
      key={`node-${uuid()}`}
      stroke={outlineColor}
      opacity={0.95}
    ></rect>
  );
};

export const DrawNodes = (props: DrawNodesProps) => {
  const { forceNodes, colorScale, chartHeight } = props;
  const radius = chartHeight / (0.8 * forceNodes.length);

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
            state.cladeDescription.muts_per_trans_minmax,
            colorScale,
            radius
          );
        } else {
          return drawCircle(
            //@ts-ignore
            forceNode,
            state.cladeDescription.muts_per_trans_minmax,
            colorScale,
            radius
          );
        }
      })}
    </g>
  );
};

export default DrawNodes;
