import { CladeDescription } from "../d";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function ClusterUniqueness(props: CladeProps) {
  const { data } = props;
  const cousin_dates: Array<number> = data.cousins.map(
    (a) => a.node_attrs.num_date.value
  );
  const cousin_locations: Set<string> = new Set(
    data.cousins.map((a) => a.node_attrs.location.value)
  );

  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "50em",
      }}
    >
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>
        How similar or distinct are your samples compared to the rest of the
        dataset?
      </h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>
        {/*TODO: show muts from parent? or shortest path from sample in cluster -> nearest cousin?*/}
        {`This genomic cluster is differentiated from background circulation by at least ${
          data.mrca ? data.mrca.branch_attrs.length : NaN
        } inherited mutation(s).`}
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
