import * as React from "react";
import { Dispatch, SetStateAction, useRef } from "react";
import { Node } from "../../../d";
import uuid from "react-uuid";

type DrawLabelsProps = {
  nodes: Node[];
  onNodeSelected: any;
};

export const DrawLabels = (props: DrawLabelsProps) => {
  const { nodes, onNodeSelected } = props;

  const DrawText = (node: Node) => {
    const ref = useRef();
    return (
      <text
        style={{ cursor: "pointer" }}
        className="label"
        key={`label-${uuid()}`}
        ref={(ref: SVGTextElement) => ref}
        onClick={() => {
          onNodeSelected((node as unknown as { index: number }).index - 1);
        }}
      >
        {node.name}
      </text>
    );
  };

  return <g className="labels">{nodes.map((node: Node) => DrawText(node))}</g>;
};
export default DrawLabels;
