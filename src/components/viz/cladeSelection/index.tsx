import { Node } from "../../../d";
import { get_leaves, traverse_preorder } from "../../../utils/treeMethods";
import { scaleLinear, extent, scaleTime, symbolCross } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { useSelector, useDispatch } from "react-redux";
//@ts-ignore
import uuid from "react-uuid";
import CladeSelectionVizControls from "./cladeSelectionVizControls";
import CladeSelectionVizLegend from "./legend";

type CladeSelectionVizProps = {
  chartHeight: number;
  chartWidth: number;
  chartMargin: number;
};

export const CladeSelectionViz = (props: CladeSelectionVizProps) => {
  const { chartHeight, chartWidth, chartMargin } = props;
  const controlsHeight = 70;
  const scatterplotHeight = chartHeight - controlsHeight;
  const showLayoutBorders = false;

  // LOCAL AND GLOBAL STATE
  // @ts-ignore
  const state = useSelector((state) => state.global);

  // DATA SETUP
  const allNodes = traverse_preorder(state.tree);
  const allSamples: Array<Node> = allNodes.filter(
    (n) => n.children.length === 0
  );
  allSamples.sort((sample1: Node, sample2: Node) => {
    return state.samplesOfInterestNames.includes(sample1.name) ? 1 : -1;
  });
  const mrcaNameToSampleNames: { [key: string]: string[] } = {};
  const allInternalNodes = allNodes.filter((n) => n.children.length >= 2);
  allInternalNodes.forEach(
    (n: Node) =>
      //@ts-ignore
      (mrcaNameToSampleNames[n.name] = get_leaves(n).map((l) => l.name))
  );

  /* colors in use */
  const lightestGray = "rgba(220,220,220,1)";
  const darkestGray = "rgba(80,80,80,1)";
  const mediumPurple = "#9475b3";
  const lightPurple = "#d9cde3";
  const darkPurple = "#4f2379";

  // AXES
  const _xScaleTime = scaleTime()
    .domain(
      //@ts-ignore
      extent(allNodes, (node) => {
        return node.node_attrs.num_date.value;
      })
    )
    .range([chartMargin * 2, chartWidth - chartMargin]);

  const _yMutsScale = scaleLinear()
    .domain(
      //@ts-ignore
      extent(allSamples, (sample) => {
        return sample.node_attrs.div;
      })
    )
    .range([scatterplotHeight - chartMargin, chartMargin]);

  const checkIfPreviewSample = (sample: Node) => {
    if (!state.previewMrca) {
      return false;
    }
    return mrcaNameToSampleNames[state.previewMrca].includes(sample.name);
  };

  const checkIfSampleOfInterest = (sample: Node) => {
    return state.samplesOfInterestNames.includes(sample.name);
  };

  const checkIfCurrentMrcaSample = (sample: Node) => {
    if (!state.mrca) {
      return false;
    }

    const currentMrcaSampleNames =
      state.cladeDescription.unselected_samples_in_cluster
        .concat(state.cladeDescription.selected_samples)
        .map((n: Node) => n.name);
    return currentMrcaSampleNames.includes(sample.name);
  };

  const plotSampleOfInterest = (
    sample: Node,
    isPreviewMrcaSample: boolean,
    isCurrentMrcaSample: boolean
  ) => {
    let color, strokeWidth;

    if (state.previewMrca) {
      // emphasize preview mrca samples, de-emphasize everything else
      color = isCurrentMrcaSample ? darkPurple : "black";
      strokeWidth = isPreviewMrcaSample ? 3 : 1;
    } else {
      // if non preview mrca, emphasize current mrca samples, all else neutral
      color = isCurrentMrcaSample ? darkPurple : "black";
      strokeWidth = isCurrentMrcaSample ? 3 : 1;
    }

    return (
      <g
        transform={`translate(
      ${_xScaleTime(sample.node_attrs.num_date.value)},
      ${_yMutsScale(sample.node_attrs.div)}
    )`}
        key={`sampleOfInterestGroup-${uuid()}`}
      >
        <line
          x1="-6"
          y1="0"
          x2="6"
          y2="0"
          stroke={color} //getMetadataColor(sample)}
          strokeWidth={strokeWidth}
          key={`sampleOfInterest-${uuid()}`}
        />
        <line
          x1="0"
          y1="-6"
          x2="0"
          y2="6"
          stroke={color} //getMetadataColor(sample)}
          strokeWidth={strokeWidth}
          key={`sampleOfInterest-${uuid()}`}
        />
      </g>
    );
  };

  const plotOtherSample = (
    sample: Node,
    isPreviewMrcaSample: boolean,
    isCurrentMrcaSample: boolean
  ) => {
    let radius, strokeWidth, color;

    if (state.previewMrca) {
      // emphasize preview mrca samples, de-emphasize everything else
      if (isPreviewMrcaSample) {
        radius = 3.5;
        strokeWidth = 1;
        color = isCurrentMrcaSample ? mediumPurple : lightestGray;
      } else {
        radius = 2;
        strokeWidth = 0;
        color = isCurrentMrcaSample ? mediumPurple : lightestGray;
      }
    } else {
      // if non preview mrca, emphasize current mrca samples, all else neutral
      if (isCurrentMrcaSample) {
        radius = 3;
        strokeWidth = 1;
        color = mediumPurple;
      } else {
        radius = 2.5;
        strokeWidth = 0;
        color = lightestGray;
      }
    }

    return (
      <circle
        key={`otherSample-${uuid()}`}
        cx={_xScaleTime(sample.node_attrs.num_date.value)}
        cy={_yMutsScale(sample.node_attrs.div)}
        r={radius}
        style={{
          fill: color,
          stroke: darkestGray,
          strokeWidth: strokeWidth,
        }}
      />
    );
  };

  const plotSample = (sample: Node) => {
    const isPreviewMrcaSample = checkIfPreviewSample(sample);
    const isSampleOfInterest = checkIfSampleOfInterest(sample);
    const isCurrentMrcaSample = checkIfCurrentMrcaSample(sample);

    if (isSampleOfInterest) {
      return plotSampleOfInterest(
        sample,
        isPreviewMrcaSample,
        isCurrentMrcaSample
      );
    } else {
      return plotOtherSample(sample, isPreviewMrcaSample, isCurrentMrcaSample);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: chartHeight,
        border: showLayoutBorders ? "1px solid red" : "none",
      }}
    >
      <div
        style={{
          height: controlsHeight,
          border: showLayoutBorders ? "1px solid yellow" : "none",
        }}
      >
        <CladeSelectionVizControls chartWidth={chartWidth} />
      </div>
      <div>
        <svg
          width={chartWidth}
          height={scatterplotHeight}
          style={{ border: showLayoutBorders ? "1px solid orange" : "none" }}
        >
          {allSamples
            .sort((a: Node, b: Node) => {
              let aVal = checkIfPreviewSample(a) + checkIfCurrentMrcaSample(a);
              let bVal = checkIfPreviewSample(b) + checkIfCurrentMrcaSample(b);
              return aVal - bVal;
            })
            .map((sample) => plotSample(sample))}

          <CladeSelectionVizLegend />
          <AxisLeft
            strokeWidth={0}
            left={chartMargin * 2}
            scale={_yMutsScale}
            label="Mutations from root"
          />
          <AxisBottom
            strokeWidth={0}
            top={scatterplotHeight - chartMargin}
            scale={_xScaleTime}
            numTicks={9}
          />
        </svg>
      </div>
    </div>
  );
};

export default CladeSelectionViz;
