import { DatasetDescription } from "../d";

// THIS KIND OF CARD DESCRIBES A DATASET
type DatasetProps = {
  data: DatasetDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function DatasetGeoCompletion(props: DatasetProps) {
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
        How representative is your dataset relative to publicly available data?
        <br />
        (Should we be concerned about sampling bias?)
      </h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>{`TITLE HERE`}</h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>{`FOO BAR ${4 + 3}`}</p>
    </div>
  );
}

export default DatasetGeoCompletion;
