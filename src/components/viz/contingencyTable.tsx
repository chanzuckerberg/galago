import { useSelector, useDispatch } from "react-redux";
import { get_leaves } from "../../utils/treeMethods";
import { Node } from "../../d";
import { FormatDataPoint } from "../formatters/dataPoint";

export const ContingencyTable = () => {
  // @ts-ignore -- TODO: figure out how to add types to state
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const allSampleNames = state.tree // everything in the tree
    ? get_leaves(state.tree).map((n: Node) => n.name)
    : null;
  const sampleNamesInCluster = state.mrca // in genomic cluster
    ? get_leaves(state.mrca).map((n: Node) => n.name)
    : null;
  const sampleOfInterestNames =
    state.samplesOfInterestNames.length > 0 // matches case definition
      ? state.samplesOfInterestNames
      : null;
  const samplesOfInterestInClusterNames = // both matches case def and is in genomic cluster
    sampleNamesInCluster && sampleOfInterestNames
      ? sampleNamesInCluster.filter((name: string) =>
          sampleOfInterestNames.includes(name)
        )
      : null;

  const nTotal = allSampleNames ? allSampleNames.length : "--";

  const nClusterOnly =
    sampleNamesInCluster && samplesOfInterestInClusterNames
      ? sampleNamesInCluster.length - samplesOfInterestInClusterNames.length
      : "--";

  const nCaseDefOnly =
    sampleOfInterestNames && samplesOfInterestInClusterNames
      ? sampleOfInterestNames.length - samplesOfInterestInClusterNames.length
      : "--";

  const nBoth = samplesOfInterestInClusterNames
    ? samplesOfInterestInClusterNames.length
    : "--";

  const neither =
    nTotal !== "--" &&
    nClusterOnly !== "--" &&
    nCaseDefOnly !== "--" &&
    nBoth !== "--"
      ? nTotal - (nClusterOnly + nCaseDefOnly + nBoth)
      : "--";

  const oddsRatio =
    neither !== "--" &&
    nClusterOnly !== "--" &&
    nCaseDefOnly !== "--" &&
    nBoth !== "--"
      ? (nBoth * neither) / (nClusterOnly * nCaseDefOnly)
      : undefined;

  return (
    <div>
      {isFinite(oddsRatio) && (
        <p className="results">
          Odds Ratio (sample of interest | in selected clade) =
          <FormatDataPoint value={oddsRatio.toFixed(1)} />
        </p>
      )}
      <div // overall table container
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "space-between",
          width: 400,
          marginTop: "3em",
          marginBottom: "3em",
        }}
      >
        <div // Row 1
          style={{
            display: "flex",
            flexDirection: "row",
            margin: 0,
            padding: 0,
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          {" "}
          <p // Top label 1
            style={{
              width: 150,
              textAlign: "right",
              fontSize: 12,
              fontWeight: 700,
              fontFamily:
                "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
            }}
          >
            {/* this page intentionally left blank */}
          </p>
          <p // Top label 2
            style={{
              width: 150,
              textAlign: "right",
              fontSize: 12,
              fontWeight: 700,
              fontFamily:
                "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
            }}
          >
            {" "}
            IS a sample of interest
          </p>
          <p // Top label 3
            style={{
              width: 150,
              textAlign: "right",
              fontSize: 12,
              fontWeight: 700,
              fontFamily:
                "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
            }}
          >
            IS NOT
            <br />a sample of interest
          </p>
        </div>
        <div // Row 2
          style={{
            display: "flex",
            flexDirection: "row",
            margin: 0,
            padding: 0,
            justifyContent: "space-between",
          }}
        >
          <p // Row 2 label
            style={{
              width: 150,
              textAlign: "right",
              fontSize: 12,
              fontWeight: 700,
              fontFamily:
                "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
            }}
          >
            IN selected clade
          </p>
          <p // Both in cluster & matching case definition
            style={{
              width: 150,
              textAlign: "right",
              fontSize: 12,
              fontWeight: 700,
              fontFamily:
                "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
            }}
          >
            {nBoth}
          </p>
          <p // Match case definition, not in cluster
            style={{
              width: 150,
              textAlign: "right",
              fontSize: 12,
              fontWeight: 700,
              fontFamily:
                "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
            }}
          >
            {nClusterOnly}
          </p>
        </div>
        <div // Row 2
          style={{
            display: "flex",
            flexDirection: "row",
            margin: 0,
            padding: 0,
            justifyContent: "space-between",
          }}
        >
          <p // Row 3 label
            style={{
              width: 150,
              textAlign: "right",
              fontSize: 12,
              fontWeight: 700,
              fontFamily:
                "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
            }}
          >
            OUT of selected clade
          </p>
          <p // In cluster only
            style={{
              width: 150,
              textAlign: "right",
              fontSize: 12,
              fontWeight: 700,
              fontFamily:
                "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
            }}
          >
            {nCaseDefOnly}
          </p>
          <p // Neither
            style={{
              width: 150,
              textAlign: "right",
              fontSize: 12,
              fontWeight: 700,
              fontFamily:
                "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
            }}
          >
            {neither}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContingencyTable;
