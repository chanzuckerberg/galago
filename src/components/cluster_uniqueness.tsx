import { CladeDescription } from "../d";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function ClusterUniqueness(props: CladeProps) {
  const { data } = props;
  const { cousin_dates } = data.cousins.map((a) => a.collection_date);
  const { cousin_locations } = new Set(data.cousins.map((a) => a.location));

  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "50em",
      }}
    >
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>How similar are your samples to the rest of the dataset?</h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>
        {/*TODO: show muts from parent? or shortest path from sample in cluster -> nearest cousin?*/}
        {`This genomic cluster is differentiated from background circulation by at least ${data.muts_from_parent} inherited mutation(s).`}
      </h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        {`The most closely related genomic cluster contains ${
          data.cousins.length
        } samples dated between 
        ${Math.min.apply(cousin_dates)} and ${Math.max.apply(cousin_dates)}
           from these location(s): ${cousin_locations}.`}
      </p>
    </div>
  );
}

export default ClusterUniqueness;
