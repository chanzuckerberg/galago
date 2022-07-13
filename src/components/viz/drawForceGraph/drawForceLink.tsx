// src/component/SimpleForceGraph/Links.tsx

import d3 from "d3";
import { forceLink, forceNode } from "../../../d";
//@ts-ignore
import uuid from "react-uuid";
import { useRef } from "react";

type DrawForceLinkProps = {
  forceLink: forceLink;
  forceNodes: forceNode[];
};

const calculateTicks = (
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  nMuts: number
) => {
  if (nMuts === 0) {
    return;
  }

  const tickHeight = 7; // total length of the tick line
  const totalLength = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** (1 / 2);
  const lengthPerMut = totalLength / nMuts;

  const theta = Math.atan((y2 - y1) / (x2 - x1));

  let tickCoordinates: any = [];

  for (
    let partialLength = lengthPerMut;
    partialLength < totalLength;
    partialLength = partialLength + lengthPerMut
  ) {
    let lengthRatio = partialLength / totalLength;
    let tickCenterX = (1 - lengthRatio) * x1 + lengthRatio * x2;
    let tickCenterY = (1 - lengthRatio) * y1 + lengthRatio * y2;

    let tickStartX = tickCenterX - (tickHeight / 2) * Math.cos(90 + theta);
    let tickEndX = tickCenterX + (tickHeight / 2) * Math.cos(90 + theta);

    let tickStartY = tickCenterY - (tickHeight / 2) * Math.sin(90 + theta);
    let tickEndY = tickCenterY + (tickHeight / 2) * Math.sin(90 + theta);
    tickCoordinates.push([tickStartX, tickEndX, tickStartY, tickEndY]);
  }
  return tickCoordinates;
};

export const DrawForceLink = (props: DrawForceLinkProps) => {
  //   const onMouseOutHandler = () => {
  //     d3.select(".linkTextValue").remove();
  //   };

  //   const onMouseOverHandler = (
  //     event: React.MouseEvent<SVGLineElement, MouseEvent>,
  //     link: Link
  //   ) => {
  //     d3.select(".linkGroup")
  //       .append("text")
  //       .attr("class", "linkTextValue")
  //       .text((link.link.value as string).replace(/(.{50})..+/, "$1…"))
  //       .attr("x", event.nativeEvent.offsetX)
  //       .attr("y", event.nativeEvent.offsetY);
  //   };

  const { forceLink, forceNodes } = props;

  let target: any = { x: undefined, y: undefined };
  let source: any = { x: undefined, y: undefined };

  if (typeof forceLink.target === "number") {
    target = forceNodes.at(forceLink.target);
  } else if (typeof forceLink.target === "object") {
    target = forceLink.target;
  }

  if (typeof forceLink.source === "number") {
    source = forceNodes.at(forceLink.source);
  } else if (typeof forceLink.source === "object") {
    source = forceLink.source;
  }

  const tickCoordinates = calculateTicks(
    source.x,
    target.x,
    source.y,
    target.y,
    forceLink.distance
  );

  return (
    <g className="linkGroup">
      <line
        className="link"
        x1={source.x}
        x2={target.x}
        y1={source.y}
        y2={target.y}
        stroke={forceLink.distance === 0 ? "none" : "black"}
        // onMouseOver={(event) => {
        //   onMouseOverHandler(event);
        // }}
        // onMouseOut={(event) => {
        //   onMouseOutHandler();
        // }}
        key={`links-${uuid()}`}
      />
      {tickCoordinates &&
        tickCoordinates.map((tick: number[]) => (
          <line
            className="tick"
            x1={tick[0]}
            x2={tick[1]}
            y1={tick[2]}
            y2={tick[3]}
            stroke="black"
          />
        ))}
    </g>
  );
};

export default DrawForceLink;
