// src/component/SimpleForceGraph/Links.tsx

import d3, { SimulationLinkDatum, SimulationNodeDatum } from "d3";
import uuid from "react-uuid";
import { useRef } from "react";

type DrawLinksProps = {
  forceLinks: SimulationLinkDatum<SimulationNodeDatum>[];
};

export const DrawLinks = (props: DrawLinksProps) => {
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

  const forceLinks = props.forceLinks;
  // console.log("links", links);
  const DrawLine = (forceLink: SimulationLinkDatum<SimulationNodeDatum>) => {
    const ref = useRef();
    return (
      <line
        ref={(ref: SVGLineElement) => ref}
        className="link"
        // onMouseOver={(event) => {
        //   onMouseOverHandler(event);
        // }}
        // onMouseOut={(event) => {
        //   onMouseOutHandler();
        // }}
        key={`links-${uuid()}`}
      />
    );
  };

  return (
    <g className="linkGroup">
      {forceLinks.map((forceLink: SimulationLinkDatum<SimulationNodeDatum>) => {
        return DrawLine(forceLink);
      })}
    </g>
  );
};

export default DrawLinks;
