import { useSelector } from "react-redux";
import Theme from "../../../theme";
import { useState } from "react";

type CladeSelectionVizLegendProps = {
  smallWindow: boolean;
};

export const CladeSelectionVizLegend = (
  props: CladeSelectionVizLegendProps
) => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const { smallWindow } = props;
  const [legendOpen, setLegendOpen] = useState(!smallWindow);

  return (
    <>
      {legendOpen ? (
        <g
          id="interactive-sample-selection-legend"
          transform="translate(50,50)"
        >
          <text y={-10} onClick={() => setLegendOpen(false)}>
            Legend &and;
          </text>
          <circle
            cx="0"
            cy="7"
            r={5}
            fill={Theme.palette.secondary.main}
            strokeWidth={1}
            stroke={"black"}
          />
          <text x="10" y="10" fontSize={14}>
            {state.samplesOfInterestNames ? "Other samples" : "Samples"}
          </text>
          {state.samplesOfInterestNames && (
            <g>
              <rect
                x="-5"
                y="20"
                width={10}
                height={10}
                strokeWidth={1}
                stroke={"black"}
                fill={Theme.palette.secondary.main}
              />
              <text x="10" y="30" fontSize={14}>
                Your samples of interest
              </text>
            </g>
          )}
          <g>
            <rect
              x="-5"
              y="40"
              width={10}
              height={10}
              strokeWidth={1}
              stroke={"black"}
              fill={Theme.palette.primary.main}
            />
            <text x="10" y="50" fontSize={14}>
              Identical to primary case
            </text>
          </g>

          <g>
            <rect
              x="-5"
              y="60"
              width={10}
              height={10}
              strokeWidth={1}
              stroke={"black"}
              fill={Theme.palette.primary.light}
            />
            <text x="10" y="70" fontSize={14}>
              Secondary / tertiary case (+1 - 2 mutations)
            </text>
          </g>

          <g>
            <rect
              x="-5"
              y="80"
              width={10}
              height={10}
              strokeWidth={1}
              stroke={"black"}
              //@ts-ignore
              fill={Theme.palette.primary.lighter}
            />
            <text x="10" y="90" fontSize={14}>
              Tertiary+ case (3+ mutations)
            </text>
          </g>
        </g>
      ) : (
        <g
          id="interactive-sample-selection-legend"
          transform="translate(50,50)"
        >
          <text y={-10} onClick={() => setLegendOpen(true)}>
            Legend &or;
          </text>
        </g>
      )}
    </>
  );
};

export default CladeSelectionVizLegend;
