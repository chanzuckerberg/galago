import { GISAIDRecord, Node } from "../../../d";
import SampleDistributionTable from "./table";
import { getNodeCounts, getGisaidCounts } from "../../../utils/countSamples";
import { useSelector } from "react-redux";
import { getNodeAttr, get_leaves } from "../../../utils/treeMethods";

interface SamplingBiasProps {
  gisaidCounts: GISAIDRecord[];
  sidenote_start: number;
}

import Sidenote from "../../formatters/sidenote";
import { FormatDataPoint } from "../../formatters/dataPoint";

function SamplingBias(props: SamplingBiasProps) {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const { gisaidCounts, sidenote_start } = props;

  const cladeDescription = state.cladeDescription;
  const cladeSamples = cladeDescription.selected_samples.concat(
    cladeDescription.unselected_samples_in_cluster
  );

  const cladeDates = cladeSamples
    .map((n: Node) => getNodeAttr(n, "num_date"))
    .sort((a: Date, b: Date) => a.getTime() - b.getTime());

  // we care about the time frame of the samples in this clade +/- 1 month
  const minDate = cladeDates[0];
  const maxDate = cladeDates.slice(-1)[0];

  const minYear = minDate.getFullYear();
  const minMonth = minDate.getMonth() - 1;
  const maxYear = maxDate.getFullYear();
  const maxMonth = maxDate.getMonth() + 1;

  const datasetLocationCount = getNodeCounts(
    get_leaves(state.tree),
    "division",
    state.cladeDescription.home_geo,
    minYear,
    minMonth,
    maxYear,
    maxMonth
  );

  const gisaidLocationCount = getGisaidCounts(
    gisaidCounts,
    "division",
    state.cladeDescription.home_geo,
    minYear,
    minMonth,
    maxYear,
    maxMonth
  );

  return (
    <div className="reportSection">
      <h2>How representative is your dataset?</h2>
      <p style={{ fontStyle: "italic" }}>
        Should you be concerned about sampling bias changing the interpretations
        in this report?
      </p>
      <p className="results">
        {
          <>
            This dataset contains{" "}
            <FormatDataPoint
              value={`${(
                (datasetLocationCount / gisaidLocationCount) *
                100
              ).toFixed(0)}%`}
            />
            of the publicly available data from{" "}
            {cladeDescription.home_geo.division} collected between
            <FormatDataPoint
              value={`${minMonth}/${minYear} - ${maxMonth}/${maxYear}`}
            />
            (+/- 1 month of the samples in this clade).
          </>
        }
      </p>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        The phylogenetic tree underlying this report represents the most likely
        genetic relationships between samples in this dataset. Importantly,
        though, the tree does not take into account cases that are not sampled
        (or not included in this dataset), which can lead to{" "}
        <Sidenote
          target={"sampling bias"}
          contents={
            <span>
              Learn more about{" "}
              <a href="https://alliblk.github.io/genepi-book/broad-use-cases-for-genomic-epidemiology.html#what-kind-of-sampling-do-you-need-to-answer-the-question">
                the importance of contextual data for outbreak analysis using
                trees
              </a>
            </span>
          }
        />{" "}
        that influences our inferences -- both for surveillance and for outbreak
        investigations
      </p>
      <p>
        One way that we can minimize sampling bias is by including enough
        representative, contextual data that is similar to our outbreak of
        interest.
      </p>
      <div // container that sets the max width to something a mobile device can handle and enables left/right scrolling
        style={{
          overflow: "visible",
          margin: "auto",
        }}
      >
        <SampleDistributionTable
          gisaidCounts={gisaidCounts}
          minMonth={minMonth}
          minYear={minYear}
          maxMonth={maxMonth}
          maxYear={maxYear}
        />
      </div>
    </div>
  );
}

export default SamplingBias;
