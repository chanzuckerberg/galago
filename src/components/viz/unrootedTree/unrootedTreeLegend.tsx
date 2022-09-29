import { useSelector } from "react-redux";
import { useState } from "react";

type UnrootedTreeLegendProps = {
  colorScale: string[];
  smallWindow: boolean;
};

export const UnrootedTreeLegend = (props: UnrootedTreeLegendProps) => {
  const { colorScale, smallWindow } = props;
  const [legendOpen, setLegendOpen] = useState(!smallWindow);

  const legendWidth = 195;
  const legendHeight = legendOpen ? 160 : 50;
  //@ts-ignore
  const state = useSelector((state) => state.global);

  const paddingX = 10;
  const paddingY = 10;

  const glyphWidth = 12;
  const glyphHeight = 12;
  const glyphCenterX = paddingX + glyphWidth / 2;
  const tickBarLength = 105;

  const colorBarStartY = paddingY + 7;
  const markerStartY = colorBarStartY + 3 * glyphHeight + 2 * paddingY;
  const tickBarStartY = markerStartY + 2 * glyphHeight + 3 * paddingY;
  const textX = paddingX * 2 + glyphWidth;

  const drawColorScaleSegment = (color: string, i: number) => {
    const colorScaleLegends = [
      "Identical (0 muts)",
      `1-2 transmissions\n(1 - ${state.mutsPerTransmissionMax * 2} muts)`,
      `3+ transmissions\n(${state.mutsPerTransmissionMax * 2 + 1}+ muts)`,
    ];
    return (
      <g key={`colorBarSegment-${i}`}>
        <rect
          x={paddingX}
          y={colorBarStartY + glyphHeight * i}
          width={glyphWidth}
          height={glyphHeight}
          fill={color}
          key={`colorBarGlyph-${i}`}
        />
        <text
          x={textX}
          y={colorBarStartY + glyphHeight * i + glyphHeight / 2}
          dominantBaseline="middle"
          fontSize={10}
          key={`colorBarText-${i}`}
        >
          {colorScaleLegends[i]}
        </text>
      </g>
    );
  };

  return (
    <>
      {legendOpen ? (
        <g id="unrooted-tree-legend" transform="translate(35,35)">
          <g id="color-bar">
            <rect
              y={-25} // cheating -- offset for including title
              width={legendWidth}
              height={legendHeight + 25}
              fill="white"
              opacity={0.8}
            />
            <text y={-10} onClick={() => setLegendOpen(false)}>
              Legend &#9650;
            </text>
            {colorScale.map((cs, i) => drawColorScaleSegment(cs, i))}
            <text x={paddingX} y={paddingY} fontSize={10}>
              Distance from putative primary case
            </text>
          </g>
          <g id="primary-case">
            <rect
              x={paddingX}
              y={markerStartY}
              width={glyphWidth}
              height={glyphWidth}
              fill={"lightGray"}
              stroke="darkGray"
            />
            <text
              x={textX}
              y={markerStartY + glyphHeight / 2}
              fontSize={10}
              dominantBaseline="middle"
            >
              Includes sample(s) of interest
            </text>
          </g>
          <g id="other samples">
            <circle
              cx={glyphCenterX}
              cy={markerStartY + glyphHeight + paddingY}
              r={glyphWidth / 1.85}
              fill="lightGray"
              stroke="darkGray"
            />

            <text
              x={textX}
              y={markerStartY + glyphHeight + paddingY}
              dominantBaseline="middle"
              fontSize={10}
            >
              Other samples
            </text>
          </g>

          {/* <line
        x1={paddingX}
        x2={paddingX + tickBarLength}
        y1={tickBarStartY}
        y2={tickBarStartY}
        stroke="darkgray"
      />
      <line
        x1={paddingX}
        x2={paddingX}
        y1={tickBarStartY + glyphHeight / 2}
        y2={tickBarStartY - glyphHeight / 2}
        stroke="darkgray"
      />
      <line
        x1={paddingX + tickBarLength / 2}
        x2={paddingX + tickBarLength / 2}
        y1={tickBarStartY + glyphHeight / 2}
        y2={tickBarStartY - glyphHeight / 2}
        stroke="darkgray"
      />
      <line
        x1={paddingX + tickBarLength}
        x2={paddingX + tickBarLength}
        y1={tickBarStartY + glyphHeight / 2}
        y2={tickBarStartY - glyphHeight / 2}
        stroke="darkgray"
      /> */}
          {/* <text
        x={paddingX}
        y={tickBarStartY + glyphHeight + paddingY}
        dominantBaseline="bottom"
        fontSize={10}
        width={tickBarLength}
      >
        Ticks each 1 mutation
      </text> */}
        </g>
      ) : (
        <g transform="translate(35,35)">
          <rect
            y={-25} // cheating -- offset for including title
            width={80}
            height={25}
            fill="white"
            opacity={0.8}
          />
          <text y={-10} onClick={() => setLegendOpen(true)}>
            Legend &#9660;
          </text>
        </g>
      )}
    </>
  );
};

export default UnrootedTreeLegend;
