import ColorLensIcon from "@mui/icons-material/ColorLens";
import Theme from "../../../theme";

export const CladeSelectionVizLegend = () => {
  return (
    <>
      <g id="interactive-sample-selection-legend" transform="translate(150,85)">
        <circle cx="0" cy="7" r={3} fill={Theme.palette.secondary.main} />
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
          fill={Theme.palette.primary.light}
          stroke={Theme.palette.secondary.dark}
          strokeWidth={1}
        />
        <text x="10" y="50" fontSize={14}>
          Other samples in active cluster
        </text>
        <g transform={`translate(0,66.5)`}>
          <line
            x1="-4"
            y1="0"
            x2="4"
            y2="0"
            stroke={Theme.palette.primary.main}
            strokeWidth={3}
          />
          <line
            x1="0"
            y1="-4"
            x2="0"
            y2="4"
            stroke={Theme.palette.primary.main}
            strokeWidth={3}
          />
        </g>
        <text x="10" y="70" fontSize={14}>
          Your samples of interest in active cluster
        </text>
      </g>
    </>
  );
};

export default CladeSelectionVizLegend;
