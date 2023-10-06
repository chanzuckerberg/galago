import { TooltipWithBounds } from "@visx/tooltip";
import { HierarchyCircularNode } from "d3";
import { Node } from "src/d";
import { useSelector } from "react-redux";
import { FormatDataPoint } from "src/components/formatters/dataPoint";

type PackLayoutTooltipProps = {
  hoveredCircle: HierarchyCircularNode<Node>;
};
const PackLayoutTooltip = ({ hoveredCircle }: PackLayoutTooltipProps) => {
  // @ts-ignore
  const state = useSelector((state) => state.global);

  const getLeafCaption = (leaf: any) => {
    const mrcaDist = leaf.data.node_attrs.div - state.mrca.node_attrs.div;
    return (
      <p>
        <b>{leaf.data.name}</b>
        <br />
        Sampled on {leaf.data.node_attrs.num_date.value.toDateString()}.
        <br />
        Separated from this clade's primary case by up to
        <FormatDataPoint
          value={Math.max(mrcaDist / state.mutsPerTransmissionMax).toFixed(0)}
        />{" "}
        transmissions (based on <FormatDataPoint value={mrcaDist} /> mutations).
      </p>
    );
  };

  const getNodeCaption = (node: any) => {
    return (
      <p>
        <b>Subclade with {node.data.node_attrs.tipCount} samples.</b>
      </p>
    );
  };

  const caption = hoveredCircle.children
    ? getNodeCaption(hoveredCircle)
    : getLeafCaption(hoveredCircle);

  return (
    <TooltipWithBounds
      key={Math.random()} // needed for bounds to update correctly
      left={hoveredCircle.x}
      top={hoveredCircle.y}
    >
      {caption}
    </TooltipWithBounds>
  );
};

export default PackLayoutTooltip;
