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
}

import Sidenote from "../sidenote";

function SamplingBias(props: SamplingBiasProps) {
  const { all_samples, gisaid_census, clade_description } = props;

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
                (get_current_counts(
                  all_samples,
                  clade_description.home_geo,
                  "division",
                  28
                ) /
                  get_gisaid_counts(
                    gisaid_census,
                    clade_description.home_geo,
                    "division",
                    28
                  )) *
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
        genetic relationships between samples in this dataset.
        <sup style={{ fontSize: 10 }}>1</sup>
        <Sidenote
          num={1}
          text=<span>Because pathogens
        evolve and spread on similar timescales, we can use this to learn about
        the transmission chain(s) that led to your samples of interest.{" "}<a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#the-transmission-tree-does-not-equate-the-phylogenetic-tree">
        Learn more.
      </a></span>
        />{" "}
        Importantly, though, the tree does not take into account cases that are
        not sampled (or not included in this dataset), which can lead to
        sampling bias that influences our inferences
        <sup style={{ fontSize: 10 }}>2</sup>.         <Sidenote
          num={2}
          text=<span>Learn more about{" "}
        <a href="https://alliblk.github.io/genepi-book/broad-use-cases-for-genomic-epidemiology.html#what-kind-of-sampling-do-you-need-to-answer-the-question">
          the importance of contextual data for outbreak analysis using trees</a></span> />
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
