import { CladeDescription, Node } from "../d";
import { get_dist } from "../utils/treeMethods";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function TMRCA(props: CladeProps) {
  const { data } = props;

  const all_samples: Node[] = data.selected_samples.concat(
    data.unselected_samples_in_cluster
  );

  let mrca_distances: Object = Object.fromEntries(
    all_samples.map((x) => [x.name, data.mrca ? get_dist([x, data.mrca]) : NaN])
  );
  let mrca_matches: string[] = Object.keys(mrca_distances).filter(
    (m: string) => mrca_distances[m] === 0
  );

  return (
    <div>
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>When did this genomic cluster arise?</h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>
        {/*TODO: show muts from parent? or shortest path from sample in cluster -> nearest cousin?*/}
        {`The primary case of this genomic cluster likely existed between ${
          data.mrca
            ? data.mrca.node_attrs.num_date.confidence[0].toFixed(2)
            : NaN
        } and ${
          data.mrca
            ? data.mrca.node_attrs.num_date.confidence[1].toFixed(2)
            : NaN
        } (95% CI).`}
      </h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        {`The primary case's pathogen genome sequence 
        ${
          mrca_matches.length === 0
            ? "does not match any samples in this dataset."
            : `was most likely identical to sample(s): ${mrca_matches}. Importantly, it is also possible that the true primary case is not be represented in this dataset (but has an identical sequence to these sample(s)). `
        }
        `}
      </p>
    </div>
  );
}

export default TMRCA;
