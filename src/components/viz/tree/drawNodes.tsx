import { D3Datum, Node } from "../../../d";

import { SimulationNodeDatum } from "d3";
import uuid from "react-uuid";

type DrawNodesProps = {
  forceNodes: SimulationNodeDatum[];
};

const DrawCircle = (forceNode: SimulationNodeDatum) => {
  return (
    <circle
      onClick={() => {
        console.log(forceNode.x);
      }}
      className="node"
      cx={200 * Math.random()}
      cy={200 * Math.random()}
      r={10}
      fill={"steelblue"}
      key={`node-${uuid()}`}
    ></circle>
  );
};

export const DrawNodes = (props: DrawNodesProps) => {
  const { forceNodes } = props;

  return (
    <g className="nodes">
      {forceNodes.map((forceNode: SimulationNodeDatum) =>
        DrawCircle(forceNode)
      )}
    </g>
  );
};

export default DrawNodes;
