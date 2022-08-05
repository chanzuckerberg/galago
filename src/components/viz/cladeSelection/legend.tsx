import ColorLensIcon from "@mui/icons-material/ColorLens";

export const CladeSelectionVizLegend = () => {
  /* colors in use */
  // const lightestGray = "rgba(220,220,220,1)";
  const mediumGray = "rgba(180,180,180,1)";
  const darkGray = "rgba(130,130,130,1)";

  return (
    <>
      <g id="interactive-sample-selection-legend" transform="translate(150,85)">
        <circle cx="0" cy="7" r={3} fill={mediumGray} />
        <text x="10" y="10" fontSize={14}>
          Other samples
        </text>
        <g transform={`translate(0,26.5)`}>
          <line x1="-4" y1="0" x2="4" y2="0" stroke="black" strokeWidth={1} />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="black" strokeWidth={1} />
        </g>
        <text x="10" y="30" fontSize={14}>
          Your samples of interest
        </text>
        <circle
          cx="0"
          cy="47"
          r={3}
          fill={"rgb(240,240,240)"}
          stroke={darkGray}
        />
        <text x="10" y="50" fontSize={14}>
          Samples in active cluster
        </text>
        <g transform={`translate(0,66.5)`}>
          <line x1="-4" y1="0" x2="4" y2="0" stroke="black" strokeWidth={2} />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="black" strokeWidth={2} />
        </g>
        <text x="10" y="70" fontSize={14}>
          Your samples of interest in active cluster
        </text>
      </g>
    </>
  );
};

export default CladeSelectionVizLegend;
