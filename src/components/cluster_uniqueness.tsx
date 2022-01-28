import { CladeDescription } from "../d";
import { get_dist } from "../utils/treeMethods";

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
    <div>
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>
        How similar or distinct are your samples compared to the rest of the
        dataset?
      </h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>
        {/*TODO: show muts from parent? or shortest path from sample in cluster -> nearest cousin?*/}
        {`This genomic cluster is differentiated from background circulation by at least ${
          data.parent_for_cousins && data.mrca
            ? get_dist([data.mrca, data.parent_for_cousins])
            : NaN
        } inherited mutation(s).`}
      </h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        {`The most closely related genomic cluster contains ${
          data.cousins.length
        } samples dated between 
        ${Math.min(...cousin_dates).toFixed(2)} and ${Math.max(
          ...cousin_dates
        ).toFixed(2)}
           from these location(s): ${cousin_locations}.`}
      </p>
    </div>
  );
}

export default ClusterUniqueness;
