import { CladeDescription } from "../d";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function TMRCA(props: CladeProps) {
  const { data } = props;

  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "50em",
      }}
    >
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>When did this genomic cluster arise?</h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>
        {/*TODO: show muts from parent? or shortest path from sample in cluster -> nearest cousin?*/}
        {`The primary case of this genomic cluster likely existed between ${data.tmrca_min} and ${data.tmrca_max} (95% CI).`}
      </h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        {`The primary case's pathogen genome sequence 
        ${
          data.mrca_matches.length == 0
            ? "does not match any samples in this dataset."
            : `was most likely identical to sample(s): ${data.mrca_matches}. Importantly, it is also possible that the true primary case is not be represented in this dataset (but has an identical sequence to these sample(s)). `
        }
        `}
      </p>
    </div>
  );
}

export default TMRCA;
