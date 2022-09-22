import { GISAIDRecord, Node } from "../../../d";
import SampleDistributionTable from "./table";
import { getCount } from "../../../utils/countSamples";
import { useSelector } from "react-redux";
import { getNodeAttr, get_leaves } from "../../../utils/treeMethods";

interface SamplingBiasProps {
  gisaidRecords: GISAIDRecord[];
}
import Sidenote from "../../formatters/sidenote";
import { FormatDataPoint } from "../../formatters/dataPoint";
import { getDateRange } from "src/utils/dates";
import { FormHelperText } from "@mui/material";

function SamplingBias(props: SamplingBiasProps) {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const { gisaidRecords } = props;

  const cladeDescription = state.cladeDescription;
  const cladeSamples = cladeDescription.selected_samples.concat(
    cladeDescription.unselected_samples_in_cluster
  );

  // we care about the time frame of the samples in this clade +/- 1 month
  let { minDate, maxDate } = getDateRange(
    cladeSamples.map((n: Node) => getNodeAttr(n, "num_date"))
  );
  minDate.setMonth(minDate.getMonth() - 1);
  maxDate.setMonth(maxDate.getMonth() + 1);

  const datasetLocationCount = getCount(
    "node",
    "division",
    state.cladeDescription.home_geo,
    minDate,
    maxDate,
    undefined,
    get_leaves(state.tree)
  );

  const gisaidLocationCount = getCount(
    "gisaid",
    "division",
    state.cladeDescription.home_geo,
    minDate,
    maxDate,
    gisaidRecords
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
              value={`${minDate.toLocaleDateString("en-us", {
                year: "numeric",
                month: "numeric",
              })} - ${maxDate.toLocaleDateString("en-us", {
                year: "numeric",
                month: "numeric",
              })}`}
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
          gisaidRecords={gisaidRecords}
          minDate={minDate}
          maxDate={maxDate}
        />
        <FormHelperText>
          Public data counts pulled from GISAID on 2020-09-20
        </FormHelperText>
      </div>
    </div>
  );
}

export default SamplingBias;
