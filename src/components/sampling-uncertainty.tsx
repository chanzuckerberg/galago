import { Node } from "../d";

// THIS KIND OF CARD DESCRIBES A DATASET
type DatasetProps = {
  data: { [key: string]: Node };
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function SamplingBias(props: DatasetProps) {
  const { data } = props;

  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "50em",
      }}
    >
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>
        How geographically representative is your dataset relative to publicly
        available data?
        <br />
        (Should we be concerned about sampling bias?)
      </h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>{`This dataset contains X% of publicly available data within X mutations of your samples.`}</h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>{`Inline plot of dataset distribution across space and time coming soon`}</p>
    </div>
  );
}

export default SamplingBias;
