import React, { useState, useEffect } from "react";
import { Node } from "../d";
import {
  get_dist,
  get_leaves,
  get_root,
  traverse_preorder,
} from "../utils/treeMethods";

import { scaleLinear, scaleBand, extent, scaleTime, rgb } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";

interface mutsDateScatterProps {
  tree: Node;
  selectedSampleNames: string[] | null;
  setSelectedSampleNames: Function;
  handleSelectedSamples: Function;
}

type sampleDataType = { name: string; date: Date; muts: number };
type internalNodeDataType = {
  name: string;
  date: Date;
  samples: string[];
};

function MutsDateScatter(props: mutsDateScatterProps) {
  const {
    tree,
    setSelectedSampleNames,
    handleSelectedSamples,
    selectedSampleNames,
  } = props;
  const [mrca, setMRCA] = useState<internalNodeDataType | null>(null);

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

  // Catalog all internal nodes (i.e., "primary cases" / MRCAs of 2+ samples) in tree
  const all_internal_nodes: Array<Node> = traverse_preorder(
    tree,
    (node: Node) => node.children.length >= 2
  );

  // Map internal nodes --> [{name, date, descendents_names}]
  const internal_node_data: internalNodeDataType[] = [];
  all_internal_nodes.forEach((node: Node) => {
    internal_node_data.push({
      name: node.name,
      date: node.node_attrs.num_date.value,
      samples: get_leaves(node).map((l: Node) => l.name),
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
        of samples based on the inferred primary case they descend from. Earlier
        primary cases usually result in broader selections.
      </p>
      <svg width={chartWidth} height={chartSize}>
        {sample_data.map((sample, i: number) => {
          const isSelected =
            mrca &&
            internal_node_data
              .find((n) => n.name === mrca.name)
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
        {internal_node_data.map((node, i) => {
          return (
            <circle
              key={i}
              onMouseEnter={() => {
                setMRCA(node);
              }}
              onMouseLeave={() => {
                if (
                  !selectedSampleNames ||
                  node.samples.length !== selectedSampleNames.length ||
                  !node.samples.every(function (value, index) {
                    return value == selectedSampleNames[index];
                  })
                ) {
                  setMRCA(null);
                }
              }}
              onClick={() => {
                setSelectedSampleNames(
                  internal_node_data.find((n) => n.name === mrca.name).samples
                );
                handleSelectedSamples();
              }}
              cx={_xScaleTime(node.date)}
              cy={38}
              r={mrca && mrca.name === node.name ? 6 : 3}
              style={{
                fill: mrca && mrca.name === node.name ? `steelblue` : `none`,
                stroke:
                  mrca && mrca.name === node.name
                    ? `rgba(70,130,180)`
                    : "rgba(180,180,180,1)",
              }}
            />
          );
        })}
        <g>
          <text x={margin - 4} y={20} fontSize={10}>
            {mrca
              ? `Selected primary case date: ${mrca.date
                  .toISOString()
                  .substring(0, 10)}. ${
                  mrca.samples.length
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
