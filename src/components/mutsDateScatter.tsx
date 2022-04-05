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
  setSelectedSampleNames: Function;
  handleSelectedSamples: Function;
}

function MutsDateScatter(props: mutsDateScatterProps) {
  const { tree, setSelectedSampleNames, handleSelectedSamples } = props;
  const root = get_root(tree);
  const [primaryCase, setPrimaryCase] = useState<string | null>(null);

  // Catalog all samples in the tree
  const all_samples: Array<Node> = get_leaves(tree);
  let sample_data_points: any = []; // [{name, date, muts from root}]
  all_samples.forEach((sample: Node) => {
    sample_data_points.push({
      name: sample.name,
      date: sample.node_attrs.num_date.value,
      muts: get_dist([root, sample]),
    });
  });

  // Catalog all internal nodes (i.e., "primary cases" / MRCAs of 2+ samples) in tree
  const all_internal_nodes = traverse_preorder(
    tree,
    (node: Node) => node.children.length >= 2
  );
  let internal_nodes_to_descendents: any = {}; // {internal node name: [sample names for all leaves descendent from this internal node]}
  all_internal_nodes.forEach((node: Node) => {
    internal_nodes_to_descendents[node.name] = get_leaves(node).map(
      (l: Node) => l.name
    );
  });

  // let internal_node_dates = {}; // {internal node name: date}
  // all_internal_nodes.forEach((node: Node) => {
  //   internal_nodes_to_descendents[node.name] = node.node_attrs.num_date;
  // });

  const internal_node_dates_ARR: any = [];
  all_internal_nodes.forEach((node: Node) => {
    internal_node_dates_ARR.push({
      name: node.name,
      date: node.node_attrs.num_date.value,
    });
  });

  const chartSize = 560;
  const chartWidth = 960;
  const margin = 30;

  const _xScaleTime = scaleTime()
    .domain(
      extent(
        sample_data_points,
        (sample: { name: string; date: string; muts: number }) => {
          return sample.date;
        }
      )
    )
    .range([margin, chartWidth - margin]);

  const _yMutsScale = scaleLinear()
    .domain(
      extent(sample_data_points, (sample: any) => {
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
        {sample_data_points.map(
          (sample: { name: string; date: string; muts: number }, i: number) => {
            const isSelected =
              primaryCase &&
              internal_nodes_to_descendents[primaryCase].indexOf(sample.name) >=
                0;

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
          }
        )}
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
        {internal_node_dates_ARR.map(
          (sample: { name: string; date: string }, i: number) => {
            return (
              <circle
                key={i}
                onMouseEnter={() => {
                  setPrimaryCase(sample.name);
                }}
                onClick={() => {
                  console.log(props);
                  if (primaryCase) {
                    setSelectedSampleNames(
                      internal_nodes_to_descendents[primaryCase]
                    );
                    handleSelectedSamples();
                  }
                }}
                cx={_xScaleTime(sample.date)}
                cy={38}
                r={primaryCase === sample.name ? 6 : 3}
                style={{
                  fill: primaryCase === sample.name ? `steelblue` : `none`,
                  stroke:
                    primaryCase === sample.name
                      ? `rgba(70,130,180)`
                      : "rgba(180,180,180,1)",
                }}
              />
            );
          }
        )}
        <g>
          <text x={margin - 4} y={20} fontSize={10}>
            Inferred 'primary cases' (hover to select a case).{" "}
            {primaryCase && `Selected primary case: ${primaryCase}`}
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
