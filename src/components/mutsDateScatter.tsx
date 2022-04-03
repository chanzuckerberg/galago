import { Node } from "../d";
import {
  get_dist,
  get_leaves,
  get_root,
  traverse_preorder,
} from "../utils/treeMethods";

import { scaleLinear, scaleBand, extent, scaleTime } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";

interface mutsDateScatterProps {
  tree: Node;
}

function MutsDateScatter(props: mutsDateScatterProps) {
  const { tree } = props;
  const all_samples: Array<Node> = get_leaves(tree);
  const all_internal_nodes = traverse_preorder(
    tree,
    (node: Node) => node.children.length === 0
  );
  const root = get_root(tree);

  let sample_data_points: any = {}; // {sample name : [date, muts from root]}

  all_samples.forEach((sample: Node) => {
    sample_data_points[sample.name] = [
      sample.node_attrs.num_date.value,
      get_dist([root, sample]),
    ];
  });
  console.log("sample_data_points", sample_data_points);

  let internal_nodes_to_descendents: any = {}; // {internal node name: [sample names for all leaves descendent from this internal node]}
  all_internal_nodes.forEach((node: Node) => {
    internal_nodes_to_descendents[node.name] = get_leaves(node).map(
      (l: Node) => {
        l.name;
      }
    );
  });

  let internal_node_dates = {}; // {internal node name: date}
  all_internal_nodes.forEach((node: Node) => {
    internal_nodes_to_descendents[node.name] = node.node_attrs.num_date;
  });

  const chartSize = 560;
  const margin = 30;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const _TEST_ARR = [10, 20, 30, 40, 80, 140];

  var _xScaleTime = scaleTime()
    .domain(
      extent(sample_data_points, (sample: Node) => {
        return new Date(d.date);
      })
    )
    .range([margin, chartSize - margin]);

  const _scaleDate = scaleBand()
    .domain(months)
    .range([0, chartSize - margin - margin]);

  const _scaleY = scaleLinear()
    .domain(extent(_TEST_ARR))
    .range([chartSize - margin, margin]);

  return (
    <div>
      <h2>Interactive sample selection</h2>
      <p>
        Select a cluster of samples based on the inferred primary case they
        descend from. Earlier primary cases usually result in broader
        selections.
      </p>
      <svg
        width={chartSize}
        height={chartSize}
        style={{ border: "1px solid black" }}
      >
        {all_samples.map((sample: Node, i: number) => {
          if (i < 5) {
            console.log(sample);
          }

          return (
            <circle
              key={i}
              cx={i}
              cy={i}
              r={2}
              style={{ fill: `rgba(255,0,0,.3)` }}
            />
          );
        })}
        <AxisLeft strokeWidth={0} left={margin} scale={_scaleY} />
        <AxisBottom
          strokeWidth={0}
          top={chartSize - margin}
          left={margin}
          scale={_scaleDate}
          tickValues={months}
        />
        <text x="-90" y="45" transform="rotate(-90)" fontSize={10}>
          Mutations
        </text>
      </svg>
      <svg width={chartSize} height={100} style={{ border: "1px solid black" }}>
        <AxisBottom
          strokeWidth={0}
          top={margin}
          left={margin}
          scale={_scaleDate}
          tickValues={months}
        />
        <text x="-90" y="45" fontSize={10}>
          Mutations
        </text>
      </svg>
    </div>
  );
}

export default MutsDateScatter;
