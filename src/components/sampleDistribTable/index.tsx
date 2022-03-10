import { CladeDescription, Node, GISAIDRecord } from "../../d";
import SampleDistributionTable from "./table";
import {
  get_current_counts,
  get_gisaid_counts,
} from "../../utils/countSamples";

interface SamplingBiasProps {
  gisaid_census: GISAIDRecord[];
  all_samples: Array<Node>;
  clade_description: CladeDescription;
  sidenote_start: number;
}

import Sidenote from "../sidenote";

function SamplingBias(props: SamplingBiasProps) {
  const { all_samples, gisaid_census, clade_description, sidenote_start } =
    props;
  const recent_from_division_num = get_current_counts(
    all_samples,
    clade_description.home_geo,
    "division",
    28
  );

  const recent_from_division_denom =
    get_gisaid_counts(
      gisaid_census,
      clade_description.home_geo,
      "division",
      28
    ) + recent_from_division_num;

  return (
    <div>
      <h2>How representative is your dataset?</h2>
      <p style={{ fontStyle: "italic" }}>
        Should you be concerned about sampling bias changing the interpretations
        in this report?
      </p>
      <p className="results">
        {
          <>
            This dataset contains{" "}
            <span className="dataPoint">
              {(
                (recent_from_division_num / recent_from_division_denom) *
                100
              ).toFixed(0)}
              %
            </span>{" "}
            of the publicly available data from{" "}
            {clade_description.home_geo.division} collected in the last 4 weeks.
          </>
        }
      </p>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        The phylogenetic tree underlying this report represents the most likely
        genetic relationships between samples in this dataset. Importantly,
        though, the tree does not take into account cases that are not sampled
        (or not included in this dataset), which can lead to sampling bias that
        influences our inferences -- both for surveillance and for outbreak
        investigations
        <sup style={{ fontSize: 10 }}>{sidenote_start}</sup>.{" "}
        <Sidenote
          num={sidenote_start}
          text={
            <span>
              Learn more about{" "}
              <a href="https://alliblk.github.io/genepi-book/broad-use-cases-for-genomic-epidemiology.html#what-kind-of-sampling-do-you-need-to-answer-the-question">
                the importance of contextual data for outbreak analysis using
                trees
              </a>
            </span>
          }
        />
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
          gisaid_census={gisaid_census}
          all_samples={all_samples}
          clade_description={clade_description}
        />
      </div>
    </div>
  );
}

export default SamplingBias;
