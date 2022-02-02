import { CladeDescription, Node, GISAIDRecord } from "../d";
import SampleDistributionTable from "./sample_distribution_table";
import {
  get_current_counts,
  get_gisaid_counts,
} from "./sample_distribution_table";

interface SamplingBiasProps {
  gisaid_census: GISAIDRecord[];
  all_samples: Array<Node>;
  selected_samples: CladeDescription;
}

function SamplingBias(props: SamplingBiasProps) {
  const { all_samples, gisaid_census, clade_description } = props;

  return (
    <div>
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>
        How representative is your dataset relative to publicly available data?
        <br />
        (Should we be concerned about sampling bias changing the interpretations
        in this report?)
      </h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>{`This dataset contains ${(
        (get_current_counts(
          all_samples,
          clade_description.home_geo,
          "division",
          36400
        ) /
          get_gisaid_counts(
            gisaid_census,
            clade_description.home_geo,
            "division",
            36400
          )) *
        100
      ).toFixed(0)}% of publicly available data from ${
        clade_description.home_geo.division
      }.`}</h2>

      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>{`The phylogenetic tree underlying this report represents the most likely genetic relationships between samples in this dataset. Because pathogens evolve and spread on similar timescales, we can use this to learn about the transmission chain(s) that led to your samples of interest. Importantly, though, the tree does not take into account cases that are not sampled (or not included in this dataset), which can lead to sampling bias that influences our inferences.`}</p>
      <p>{`One way that we can minimize sampling bias is by including enough representative, contextual data that is similar to our outbreak of interest.`}</p>
      <div // container that sets the max width to something a mobile device can handle and enables left/right scrolling
        style={{
          maxWidth: 500,
          overflow: "scroll",
          margin: "auto",
        }}
      >
        <SampleDistributionTable
          gisaid_census={gisaid_census}
          all_samples={all_samples}
          selected_samples={clade_description.selected_samples}
        />
      </div>
      <p>
        Learn more about{" "}
        <a href="https://alliblk.github.io/genepi-book/broad-use-cases-for-genomic-epidemiology.html#what-kind-of-sampling-do-you-need-to-answer-the-question">
          the importance of contextual data for outbreak analysis using trees
        </a>{" "}
        and{" "}
        <a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#the-transmission-tree-does-not-equate-the-phylogenetic-tree">
          the differences between transmission trees and phylogenetic trees.
        </a>
      </p>
    </div>
  );
}

export default SamplingBias;
