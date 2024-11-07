import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Theme } from "../../../theme";
import { Group } from "@visx/group";
import { Pack, hierarchy } from "@visx/hierarchy";
import { Node } from "src/d";
import PackLayoutTooltip from "./packLayoutTooltip";
import { HierarchyCircularNode } from "d3";
import { get_dist } from "src/utils/treeMethods";
import CladeSelectionVizLegend from "./cladeSelectionVizLegend";

type PackLayoutProps = {
  width: number;
  height: number;
  margin: number;
};

const PackLayout = ({ width, height, margin }: PackLayoutProps) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const [hoveredSample, setHoveredSample] =
    useState<HierarchyCircularNode<Node> | null>(null);

  const handleMouseEnter = (node: HierarchyCircularNode<Node>) => {
    setHoveredSample(node);
  };

  const handleMouseLeave = () => {
    setHoveredSample(null);
  };

  const checkIfSampleOfInterest = (sample: HierarchyCircularNode<Node>) => {
    return state.samplesOfInterestNames.includes(sample.data.name);
  };

  const checkIfInternal = (sample: HierarchyCircularNode<Node>) => {
    return sample.children !== undefined && sample.children.length > 0;
  };

  // min n transmissions bn samples: color
  const colorScale = {
    0: Theme.palette.primary.main,
    1: Theme.palette.primary.light,
    // @ts-expect-error
    2: Theme.palette.primary.lighter,
  };

  const getColor = (node: HierarchyCircularNode<Node>) => {
    const nMuts = get_dist([node.data, state.mrca]);
    const threshold = state.mutsPerTransmissionMax;
    if (nMuts === 0) {
      return colorScale[0];
    } else if (nMuts <= threshold * 2) {
      return colorScale[1];
    } else {
      return colorScale[2];
    }
  };

  const plotSampleOfInterest = (sample: HierarchyCircularNode<Node>) => {
    const color = getColor(sample);

    return (
      <rect
        x={sample.x - sample.r / 1.5}
        y={sample.y - sample.r / 1.5}
        width={1.5 * sample.r}
        height={1.5 * sample.r}
        fill={color}
        key={`node-${sample.data.name}`}
        stroke={"black"}
        strokeWidth={2}
        cursor={"pointer"}
        // onMouseMove={() => {
        //   tooltip.showTooltip({
        //     tooltipData: tipsRepresented(node),
        //     tooltipLeft: x,
        //     tooltipTop: y,
        //   });
        // }}
        // onMouseLeave={() => {
        //   tooltip.hideTooltip();
        // }}
      />
    );
  };

  const plotOtherSample = (
    sample: HierarchyCircularNode<Node>,
    isInternal: boolean
  ) => {
    return (
      <circle
        key={`circle-${sample.data.name}`}
        r={sample.r}
        cx={sample.x}
        cy={sample.y}
        fill={isInternal ? "mediumgray" : getColor(sample)}
        fillOpacity={isInternal ? 0.1 : 1}
        onClick={() =>
          dispatch({
            type: "mrca selected",
            data:
              sample.data.node_attrs.tipCount > 0 || sample.parent === null
                ? sample.data.name
                : sample.parent.data.name,
          })
        }
        stroke={"black"}
        strokeWidth={isInternal ? 0 : 2}
        onMouseEnter={() => setHoveredSample(sample)}
        onMouseLeave={() => setHoveredSample(null)}
        cursor={"pointer"}
      />
    );
  };

  const plotSample = (sample: HierarchyCircularNode<Node>) => {
    const isSampleOfInterest = checkIfSampleOfInterest(sample);
    const isInternal = checkIfInternal(sample);

    if (isInternal || !isSampleOfInterest) {
      return plotOtherSample(sample, isInternal);
    } else {
      return plotSampleOfInterest(sample);
    }
  };

  const root = hierarchy<Node>(state.mrca, (d) => d.children)
    .count() //(d) => d.node_attrs.tipCount + 1)
    .sort(
      (a, b) =>
        // sort by hierarchy, then distance
        a.data.node_attrs.div - b.data.node_attrs.div ||
        (a.children ? 1 : -1) - (b.children ? 1 : -1)
    );

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="#ffffff" />

      <Pack<Node> root={root} size={[width, height]}>
        {(packData) => {
          const samples = packData.descendants().slice(1); // skip outer hierarchies
          return (
            <Group>
              {samples.map((sample, i) => (
                <g
                  key={i}
                  onMouseEnter={() =>
                    handleMouseEnter(sample as HierarchyCircularNode<Node>)
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  {plotSample(sample as HierarchyCircularNode<Node>)}
                </g>
              ))}
              {hoveredSample && (
                <g>
                  <rect
                    x={hoveredSample.x - 6}
                    y={hoveredSample.y - 15}
                    width={hoveredSample.data.name.length * 10}
                    height="20"
                    fill="white"
                    opacity={0.8}
                    rx="4"
                    ry="4"
                    style={{ pointerEvents: "none" }}
                  />
                  <text
                    y={hoveredSample.y}
                    x={hoveredSample.x}
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      pointerEvents: "none",
                      fill: "black",
                    }}
                  >
                    {hoveredSample.data.name}
                  </text>
                </g>
              )}
            </Group>
          );
        }}
      </Pack>

      <CladeSelectionVizLegend smallWindow={height < 350} />
    </svg>
  );
};

export default PackLayout;
