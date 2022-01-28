import { CladeDescription, Node, GISAIDRecord } from "../d";
import SampleDistributionTable from "./sample_distribution_table";

interface SamplingBiasProps {
  gisaid_census: GISAIDRecord[];
  all_samples: Array<Node>;
  selected_samples: Array<Node>;
}

function SamplingBias(props: SamplingBiasProps) {
  const { all_samples, gisaid_census, selected_samples } = props;
  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "50em",
      }}
    >
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>
        [WIP] How representative is your dataset relative to publicly available
        data?
        <br />
        (Should we be concerned about sampling bias changing the interpretations
        in this report?)
      </h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>{`This dataset contains X% of publicly available data within X mutations of your samples.`}</h2>

      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>{`Write up some explanation of how we can only make inferences based on the data we know exists and missing data can skew our interpretations. `}</p>
      <div // container that sets the max width to something a mobile device can handle and enables left/right scrolling
        style={{
          maxWidth: 500,
          overflow: "scroll",
          // box-shadow: "inset -3px -3px 10px 5px #999999",
        }}
      >
        {/* <SampleDistributionTable data={props} /> */}
      </div>
    </div>
  );
}

export default SamplingBias;
