import { D3Datum, Node } from "../../../d";
import * as React from "react";
import * as d3 from "d3";
import { D3DragEvent, Simulation, SimulationNodeDatum } from "d3";
import uuid from "react-uuid";
import { useRef } from "react";

type DrawNodesProps = {
  forceNodes: SimulationNodeDatum[];
  restartDrag: () => void;
  stopDrag: () => void;
};

export const DrawNodes = (props: DrawNodesProps) => {
  const { forceNodes, restartDrag, stopDrag } = props;
  const ref = useRef();

  const DrawCircle = (forceNode: SimulationNodeDatum) => {
    return (
      <circle
        className="node"
        r={50}
        fill={"steelblue"}
        key={`node-${uuid()}`}
        ref={(ref: SVGCircleElement) => ref}
      ></circle>
    );
  };

  const onDragStart = (event: D3DragEvent<SVGCircleElement>, d: D3Datum) => {
    if (!event.active) {
      restartDrag();
    }
    d.fx = d.x;
    d.fy = d.y;
  };

  const onDrag = (
    event: D3DragEvent<SVGCircleElement, never, never>,
    d: D3Datum
  ) => {
    d.fx = event.x;
    d.fy = event.y;
  };

  const onDragEnd = (
    event: D3DragEvent<SVGCircleElement, never, never>,
    d: D3Datum
  ) => {
    if (!event.active) {
      stopDrag();
    }
    d.fx = null;
    d.fy = null;
  };

  d3.selectAll(".node").call(
    d3
      .drag<SVGCircleElement, D3Datum>()
      .on("start", onDragStart)
      .on("drag", onDrag)
      .on("end", onDragEnd)
  );

  return (
    <g className="nodes">
      {forceNodes.map((forceNode: SimulationNodeDatum) =>
        DrawCircle(forceNode)
      )}
    </g>
  );
};

export default DrawNodes;
