import { CladeSelectionViz } from "./viz/cladeSelection";

type MainVizProps = {
  sectionHeight: number;
  sectionWidth: number;
};

export const MainViz = (props: MainVizProps) => {
  const { sectionHeight, sectionWidth } = props;
  const chartMargin = 30;

  const showLayoutBorders = false;

  return (
    <div
      style={{
        height: sectionHeight,
        width: sectionWidth,
        paddingTop: 25,
        border: showLayoutBorders ? "1px solid red" : "none",
      }}
    >
      <CladeSelectionViz
        height={sectionHeight}
        width={sectionWidth}
        margin={chartMargin}
      />
    </div>
  );
};

export default MainViz;
