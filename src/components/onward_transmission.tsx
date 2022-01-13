import { CladeDescription } from "../d";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function OnwardTransmission(props: CladeProps) {
  const { data } = props;

  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "50em",
      }}
    >
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>How much onward transmission have we observed?</h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>
        {/*TODO: show muts from parent? or shortest path from sample in cluster -> nearest cousin?*/}
        {`In this cluster, ${
          data.mrca_matches.length
        } sample(s) are identical to the primary case; ${
          data.n_total_samples -
          data.mrca_matches.length -
          data.n_onward_with_accumulated_muts
        } sample(s) have 1-2 mutations relative to the primary case; and ${
          data.n_onward_with_accumulated_muts
        } sample(s) with ${
          data.onward_muts_threshold
        }+ mutations from the primary case.`}
      </h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        {`Differentiating between a superspreader event (where one primary cases transmits to many secondary cases) and onward transmission (here, defined as tertiary or further downstream cases), can be tricky. Mutations occur as a pathogen replicates within the host's body, which means that any individual case has multiple pathogen genotypes present in their body. Usually, a primary case transmits one dominant pathogen genotype to all of their secondary cases, but sometimes you may observe a few different genotypes which vary by 1-${
          data.onward_muts_threshold - 1
        } mutations being transmitted during the same superspreader event.`}
      </p>
      <p>
        {`As a rule of thumb, we generally consider it unlikely for samples which
        are identical to the primary case to be the result of onward
        transmission. Samples with 1 - ${data.onward_muts_threshold - 1}
        mutations may be secondary cases or further downstream.`}
      </p>
      <p>
        {`It's usually a reasonable to assume that samples with 
        ${data.onward_muts_threshold}+ mutations represent tertiary or further
        downstream transmission.`}
      </p>
    </div>
  );
}

export default OnwardTransmission;
