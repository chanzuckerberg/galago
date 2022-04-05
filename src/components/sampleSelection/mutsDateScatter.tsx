import React, { useState, useEffect } from "react";
import { Node } from "../../d";
import {
  get_dist,
  get_leaves,
  get_root,
  traverse_preorder,
} from "../../utils/treeMethods";

import { scaleLinear, scaleBand, extent, scaleTime, rgb } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";

interface mutsDateScatterProps {
  tree: Node;
  mrca: any;
  setMRCA: Function;
  mrcaOptions: internalNodeDataType[];
}

type sampleDataType = { name: string; date: Date; muts: number };
type internalNodeDataType = {
  name: string;
  date: Date;
  samples: string[];
  raw: Node;
};

function MutsDateScatter(props: mutsDateScatterProps) {
  const { tree, setMRCA, mrca, mrcaOptions } = props;
  const [previewMRCA, setPreviewMRCA] = useState<internalNodeDataType | null>(
    null
  );

  const root = get_root(tree);

  // Catalog all samples in the tree --> // [{name, date, muts from root}]
  const all_samples: Array<Node> = get_leaves(tree);
  let sample_data: sampleDataType[] = [];
  all_samples.forEach((sample: Node) => {
    sample_data.push({
      name: sample.name,
      date: sample.node_attrs.num_date.value,
      muts: get_dist([root, sample]),
    });
  });

  const chartSize = 560;
  const chartWidth = 960;
  const margin = 30;

  const _xScaleTime = scaleTime()
    .domain(
      //@ts-ignore
      extent(sample_data, (sample) => {
        return sample.date;
      })
    )
    .range([margin, chartWidth - margin]);

  const _yMutsScale = scaleLinear()
    .domain(
      //@ts-ignore
      extent(sample_data, (sample) => {
        return sample.muts;
      })
    )
    .range([chartSize - margin, margin]);

  return (
    <div>
      <h2>Interactive sample selection</h2>
      <p>
        To instantly generate a report for any set of samples, select a cluster
        of samples based on the inferred primary case they descend from.
      </p>
      <svg width={chartWidth} height={chartSize}>
        {sample_data.map((sample, i: number) => {
          const isSelected =
            previewMRCA &&
            //@ts-ignore
            mrcaOptions
              .find((n) => n.name === previewMRCA.name)
              .samples.includes(sample.name);
          return (
            <circle
              key={i}
              cx={_xScaleTime(sample.date)}
              cy={_yMutsScale(sample.muts)}
              r={3}
              style={{
                fill: isSelected ? "steelblue" : `none`,
                stroke: isSelected ? "steelblue" : "rgba(180,180,180,1)",
              }}
            />
          );
        })}
        <AxisLeft strokeWidth={0} left={margin} scale={_yMutsScale} />
        <AxisBottom
          strokeWidth={0}
          top={chartSize - margin}
          scale={_xScaleTime}
          numTicks={9}
        />
        <text x="-150" y="45" transform="rotate(-90)" fontSize={10}>
          Mutations
        </text>
      </svg>
      <svg width={chartWidth} height={100}>
        {mrcaOptions.map((node, i) => {
          return (
            <circle
              key={i}
              onMouseEnter={() => {
                setPreviewMRCA(node);
              }}
              // onMouseLeave={() => {
              //   if (!previewMRCA || previewMRCA.name !== mrca.name) {
              //     setPreviewMRCA(null);
              //   }
              // }}
              onClick={() => {
                setMRCA(node.raw);
              }}
              cx={_xScaleTime(node.date)}
              cy={38}
              r={previewMRCA && previewMRCA.name === node.name ? 6 : 3}
              style={{
                fill:
                  previewMRCA && previewMRCA.name === node.name
                    ? `steelblue`
                    : `none`,
                stroke:
                  previewMRCA && previewMRCA.name === node.name
                    ? `rgba(70,130,180)`
                    : "rgba(180,180,180,1)",
              }}
            />
          );
        })}
        <g>
          <text x={margin - 4} y={20} fontSize={10}>
            {previewMRCA
              ? `Selected primary case date: ${previewMRCA.date
                  .toISOString()
                  .substring(0, 10)}. ${
                  previewMRCA.samples.length
                } descendent samples.`
              : `Inferred 'primary cases' (hover to select a case).`}
          </text>
          <text x={margin - 4} y={60} fontSize={10} fontStyle="italic">
            broader selection
          </text>
          <text
            x={chartWidth - margin - 90}
            y={60}
            fontSize={10}
            fontStyle="italic"
          >
            narrower selection
          </text>
        </g>
      </svg>
    </div>
  );
}

export default MutsDateScatter;
