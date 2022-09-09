import { Node } from "../../../d";
import * as d3 from "d3";
//@ts-ignore
import uuid from "react-uuid";
import { useSelector } from "react-redux";
import {
  getNodeAttr,
  get_dist,
  traverse_preorder,
} from "../../../utils/treeMethods";
import {
  containsSamplesOfInterest,
  getColor,
} from "../../../utils/unrootedTree";

type DrawUnrootedTreeProps = {
  colorScale: [string, string, string];
  chartWidth: number;
  chartHeight: number;
  chartMargin: number;
  scaleDomainX: [number, number];
  scaleDomainY: [number, number];
  scaleDomainR: [number, number];
  tooltip: any;
};

const outlineColor = "gray";

const tipsRepresented = (node: Node) => {
  if (node.children.length === 0) {
    return [node];
  } else {
    return node.children.filter(
      (child: Node) =>
        child.children.length === 0 && child.branch_attrs.length === 0
    );
  }
};

const drawSquare = (
  node: Node,
  mrca: Node,
  mutsPerTransmissionMax: number,
  colorScale: [string, string, string],
  scaleX: Function,
  scaleY: Function,
  scaleR: Function,
  tooltip: any
) => {
  const [color, markerColor] = getColor(
    node,
    mrca,
    mutsPerTransmissionMax,
    colorScale
  );
  const size = scaleR(Math.max(5, getNodeAttr(node, "nodeSize")));
  const x = scaleX(getNodeAttr(node, "x"));
  const y = scaleY(getNodeAttr(node, "y"));

  return (
    <g className="square node">
      <rect
        x={x - size}
        y={y - size}
        width={2 * size}
        height={2 * size}
        fill={color}
        key={`node-${uuid()}`}
        stroke={outlineColor}
        opacity={0.95}
        onMouseMove={() => {
          tooltip.showTooltip({
            tooltipData: tipsRepresented(node),
            tooltipLeft: x,
            tooltipTop: y,
          });
        }}
        onMouseLeave={() => {
          tooltip.hideTooltip();
        }}
      />
    </g>
  );
};

const drawCircle = (
  node: Node,
  mrca: Node,
  mutsPerTransmissionMax: number,
  colorScale: [string, string, string],
  scaleX: Function,
  scaleY: Function,
  scaleR: Function,
  tooltip: any
) => {
  const [color, markerColor] = getColor(
    node,
    mrca,
    mutsPerTransmissionMax,
    colorScale
  );

  const x = scaleX(getNodeAttr(node, "x"));
  const y = scaleY(getNodeAttr(node, "y"));
  const size = scaleR(getNodeAttr(node, "nodeSize"));

  return (
    <g className="circle node">
      <circle
        onClick={() => {}}
        className="node"
        cx={x}
        cy={y}
        r={size}
        fill={color}
        key={`node-${uuid()}`}
        opacity={0.95}
        stroke={outlineColor}
        onMouseMove={() => {
          tooltip.showTooltip({
            tooltipData: tipsRepresented(node),
            tooltipLeft: x,
            tooltipTop: y,
          });
        }}
        onMouseLeave={() => {
          tooltip.hideTooltip();
        }}
      />
    </g>
  );
};

export const DrawUnrootedTree = (props: DrawUnrootedTreeProps) => {
  const {
    colorScale,
    chartWidth,
    chartHeight,
    chartMargin,
    scaleDomainX,
    scaleDomainY,
    scaleDomainR,
    tooltip,
  } = props;

  const scaleX = d3
    .scaleLinear()
    .domain(scaleDomainX)
    .range([chartMargin, chartWidth - chartMargin]);

  const scaleY = d3
    .scaleLinear()
    .domain(scaleDomainY)
    .range([chartMargin, chartHeight - chartMargin]);

  const scaleR = d3.scaleLinear().domain(scaleDomainR).range([6, 20]);

  // @ts-ignore
  const state = useSelector((state) => state.global);

  // only draw nodes with size > 0 (i.e., internal nodes with polytomies and leaves that aren't already polytomies)
  const nodesToDraw = traverse_preorder(state.mrca).filter(
    (n: Node) => getNodeAttr(n, "nodeSize") > 0
  );

  // only draw links to internal nodes & non-polytomy leaves
  const linksToDraw = traverse_preorder(state.mrca).filter((n: Node) => {
    if (n.children.length === 0 && getNodeAttr(n, "nodeSize") > 0) {
      return true;
    } else if (n.children.length > 0) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <g className="nodes">
      {linksToDraw.map((node: Node) => {
        if (node.parent && node !== state.mrca) {
          return (
            <line
              className="link"
              x1={scaleX(getNodeAttr(node.parent, "x"))}
              x2={scaleX(getNodeAttr(node, "x"))}
              y1={scaleY(getNodeAttr(node.parent, "y"))}
              y2={scaleY(getNodeAttr(node, "y"))}
              stroke={"gray"}
              markerEnd={"url(#arrowHead)"}
              // onMouseOver={(event) => {
              //   onMouseOverHandler(event);
              // }}
              // onMouseOut={(event) => {
              //   onMouseOutHandler();
              // }}
              key={`links-${uuid()}`}
            />
          );
        }
      })}

      {nodesToDraw.map((node: Node) => {
        if (containsSamplesOfInterest(node, state.samplesOfInterestNames)) {
          return drawSquare(
            node,
            state.mrca,
            state.mutsPerTransmissionMax,
            colorScale,
            scaleX,
            scaleY,
            scaleR,
            tooltip
          );
        } else {
          //@ts-ignore
          return drawCircle(
            //@ts-ignore
            node,
            state.mrca,
            state.mutsPerTransmissionMax,
            colorScale,
            scaleX,
            scaleY,
            scaleR,
            tooltip
          );
        }
      })}
    </g>
  );
};

export default DrawUnrootedTree;
