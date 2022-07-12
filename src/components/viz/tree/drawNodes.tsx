import { forceNode, forceLink, Node } from "../../../d";

import { SimulationNodeDatum } from "d3";
//@ts-ignore
import uuid from "react-uuid";
import { useSelector } from "react-redux";

type DrawNodesProps = {
  forceNodes: forceNode[];
};

const darkPurple = "#4f2379";
const mediumPurple = "#9475b3";
const lightPurple = "#d9cde3";

const outlineColor = "rgba(80,80,80,1)";
const radius = 10;

const getColor = (forceNode: forceNode, muts_per_trans_minmax: number[]) => {
  //@ts-ignore -- not sure why the `extend` works for forceLink but not forceNode in d.ts
  if (forceNode.mrcaDist === 0) {
    return darkPurple;
    //@ts-ignore
  } else if (
    //@ts-ignore
    forceNode.mrcaDist < muts_per_trans_minmax[1]
  ) {
    return mediumPurple;
  } else {
    return lightPurple;
  }
};

const drawCircle = (forceNode: forceNode, muts_per_trans_minmax: number[]) => {
  const color = getColor(forceNode, muts_per_trans_minmax);
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

const drawSquare = (forceNode: forceNode, muts_per_trans_minmax: number[]) => {
  const color = getColor(forceNode, muts_per_trans_minmax);
  return (
    <rect
      onClick={() => {}}
      className="node"
      x={forceNode.x ? forceNode.x - radius : NaN}
      y={forceNode.y ? forceNode.y - radius : NaN}
      width={radius * 1.5}
      height={radius * 1.5}
      fill={color}
      key={`node-${uuid()}`}
      stroke={outlineColor}
      opacity={0.95}
    ></rect>
  );
};

export const DrawNodes = (props: DrawNodesProps) => {
  const { forceNodes } = props;
  // @ts-ignore
  const state = useSelector((state) => state.global);

  return (
    <g className="nodes">
      {forceNodes.map((forceNode: SimulationNodeDatum) => {
        //@ts-ignore
        if (state.samplesOfInterestNames.includes(forceNode.id)) {
          return drawSquare(
            forceNode,
            state.cladeDescription.muts_per_trans_minmax
          );
        } else {
          return drawCircle(
            forceNode,
            state.cladeDescription.muts_per_trans_minmax
          );
        }
      })}
    </g>
  );
};

export default DrawNodes;
