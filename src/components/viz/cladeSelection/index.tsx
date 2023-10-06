import CladeSelectionVizControls from "./cladeSelectionVizControls";
// import CladeSelectionVizLegend from "./scatterplotLegend";
import PackLayout from "./packLayout";

type CladeSelectionVizProps = {
  height: number;
  width: number;
  margin: number;
};

export const CladeSelectionViz = (props: CladeSelectionVizProps) => {
  let { height, width, margin } = props;
  const controlsHeight = 70;
  const chartHeight = height - controlsHeight;
  const showLayoutBorders = false;

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
        <CladeSelectionVizControls sectionWidth={width} />
      </div>
      <div>
        <PackLayout width={width} height={chartHeight} margin={margin} />
      </div>
    </div>
  );
};

export default CladeSelectionViz;
