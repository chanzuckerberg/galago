import { CladeDescription, Sample } from "../d";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function OnwardTransmission(props: CladeProps) {
  const { data } = props;

  const { mrca_matches } = data.selected_samples
    .filter((s) => s.muts_from_mrca === 0)
    .concat(
      data.unselected_samples_in_cluster.filter((s) => s.muts_from_mrca === 0)
    );

  const { gray_zone } = data.selected_samples
    .filter(
      (s) =>
        s.muts_from_mrca > data.muts_per_trans_minmax[0] &&
        s.muts_from_mrca <= data.muts_per_trans_minmax[1]
    )
    .concat(
      data.unselected_samples_in_cluster.filter(
        (s) =>
          s.muts_from_mrca > data.muts_per_trans_minmax[0] &&
          s.muts_from_mrca <= data.muts_per_trans_minmax[1]
      )
    );

  const { onward } = data.selected_samples
    .filter((s) => s.muts_from_mrca > data.muts_per_trans_minmax[1])
    .concat(
      data.unselected_samples_in_cluster.filter(
        (s) => s.muts_from_mrca > data.muts_per_trans_minmax[1]
      )
    );

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
          mrca_matches.length
        } sample(s) are identical to the primary case; ${
          gray_zone.length
        } sample(s) have ${data.muts_per_trans_minmax[0] + 1} - ${
          data.muts_per_trans_minmax[1]
        } mutations relative to the primary case; and ${
          data.onward.length
        } sample(s) with ${
          data.muts_per_trans_minmax[1] + 1
        }+ mutations from the primary case.`}
      </h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        {`Differentiating between a superspreader event (where one primary cases transmits to many secondary cases) and onward transmission (here, defined as tertiary or further downstream cases), can be tricky. Mutations occur as a pathogen replicates within the host's body, which means that any individual case has multiple pathogen genotypes present in their body. Usually, a primary case transmits one dominant pathogen genotype to all of their secondary cases, but sometimes you may observe a few different genotypes which vary by 1 - ${data.muts_per_trans_minmax[1]} mutations being transmitted during the same superspreader event.`}
      </p>
      <p>
        {`As a rule of thumb, we generally consider it unlikely for samples which
        are identical to the primary case to be the result of onward
        transmission. Samples with 1 - ${data.muts_per_trans_minmax[1]}
        mutations may either be secondary cases or further downstream.`}
      </p>
      <p>
        {`It's usually a reasonable to assume that samples with 
        ${
          data.muts_per_trans_minmax[1] + 1
        }+ mutations represent tertiary or further
        downstream transmission.`}
      </p>
    </div>
  );
}

export default OnwardTransmission;
