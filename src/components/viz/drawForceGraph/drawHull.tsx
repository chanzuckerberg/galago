import { polygonHull } from "d3-polygon";
import { forceNode } from "../../../d";

type drawHullsProps = {
  polytomyNodes: forceNode[];
};

const hullColor = "rgba(220,220,220,1)";

export const DrawHull = (props: drawHullsProps) => {
  const { polytomyNodes } = props;
  const points: Array<[number, number]> = [];
  polytomyNodes.forEach((pn: forceNode) => {
    if (pn.x && pn.y) {
      points.push([pn.x, pn.y]);
    }
  });

  const hull = polygonHull(points);
  console.log("polytomy", polytomyNodes, "points", points, "hull", hull);

  if (hull) {
    return (
      <path
        d={`M${hull.join("L")}Z`}
        style={{ stroke: "red", strokeWidth: 30 }}
      />
    );
  } else {
    return <></>;
  }
};

export default DrawHull;
