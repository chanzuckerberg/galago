import { Node } from "../../../d";
import { FormatDate } from "../../formatters/date";
import { FormatDataPoint } from "../../formatters/dataPoint";
import { MiniCladeDescription } from "./miniCladeDescription";
import { EpiCurve } from "../../viz/epiCurve";
import { getNodeAttr, get_dist } from "../../../utils/treeMethods";
import { useSelector } from "react-redux";
import ContingencyTable from "../../viz/contingencyTable";
import { useWindowSize } from "@react-hook/window-size";
import Sidenote from "../../formatters/sidenote";
import Theme from "../../../theme";

export const SitStat = () => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const cladeDescription = state.cladeDescription;
  const [windowWidth, windowHeight] = useWindowSize();

  return (
    <div>
      <h2>Genomic situation status</h2>
      <h5>About this cluster ("clade")</h5>
      <p style={{ fontStyle: "italic" }}>
        A "clade" is a hierarchical cluster in a{" "}
        <Sidenote
          target={" phylogenetic tree"}
          contents={
            <>
              This is conceptually similar to your family tree: the branching
              patterns show us that you are more closely related to your
              siblings than to your cousins, and that you are more closely
              related to your cousins than to a stranger.{" "}
              <a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#what-is-a-phylogenetic-tree">
                Learn more about 'clades.'
              </a>
            </>
          }
        />
        .
      </p>
      <MiniCladeDescription />
      <h5>Timeline</h5>
      <EpiCurve
        chartHeight={windowWidth * 0.15}
        chartWidth={windowWidth * 0.35}
        chartMargin={60}
      />
      {!isNaN(getNodeAttr(state.mrca, "num_date")) && (
        <span
          style={{
            fontWeight: "bold",
            fontSize: 12,
            color: Theme.palette.primary.main,
          }}
        >
          * The primary case most likely existed around{" "}
          <FormatDate date={state.mrca.node_attrs.num_date.value} />{" "}
        </span>
      )}
      {state.samplesOfInterest.length > 0 && (
        <>
          <h5>
            How good is the overlap of your Samples of Interest and this clade?
          </h5>
          <ContingencyTable />
        </>
      )}
    </div>
  );
};
