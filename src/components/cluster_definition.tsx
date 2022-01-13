import { CladeDescription } from "../d";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function ClusterDefinition(props: CladeProps) {
  const { data } = props;

  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "50em",
      }}
    >
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>How closely related are your selected samples?</h4>
      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>
        {` 
        ${
          data.samples_monophyletic // TITLE CHANGES DEPENDING ON IF SAMPLES FORM A MONOPHYLETIC SUBCLADE
            ? `Your ${data.n_selected_samples} selected samples are all more closely related to each other than to anything else in this dataset.`
            : `Your ${
                data.n_selected_samples
              } selected samples are also closely related to ${
                data.n_total_samples - data.n_selected_samples
              } samples from other locations.`
        }`}
      </h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        {`Your selected samples are separated from each other by
        ${data.min_bn_sample_muts} - ${data.max_bn_sample_muts} mutations (or,
        on average, about ${data.min_bn_sample_muts * data.min_trans_per_mut} - 
        ${data.max_bn_sample_muts * data.max_trans_per_mut} transmission
        events).`}
      </p>
      <p>
        {` 
        ${
          data.samples_monophyletic
            ? `These samples form their own genomic cluster.`
            : `The genomic cluster containing your samples also includes ${
                data.n_total_samples - data.n_selected_samples
              } samples from these locations: ${
                data.unselected_sample_locations
              }.`
        }
        Here, "genomic cluster" means the smallest subtree or "clade" that contains all of your samples. You can also think of this as the shortest plausible transmission chain connecting your samples to each other.`}
      </p>
    </div>
  );
}

export default ClusterDefinition;
