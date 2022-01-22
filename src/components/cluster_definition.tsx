import { CladeDescription } from "../d";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function ClusterDefinition(props: CladeProps) {
  const { data } = props;
  console.log(data.unselected_samples_in_cluster);
  const locations = data.unselected_samples_in_cluster.map(
    (a) => a.node_attrs.location.value
  );
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
          data.unselected_samples_in_cluster.length == 0 // TITLE CHANGES DEPENDING ON IF SAMPLES FORM A MONOPHYLETIC SUBCLADE
            ? `Your ${data.selected_samples.length} selected samples are all more closely related to each other than to anything else in this dataset and form their own "genomic cluster."`
            : `Your ${data.selected_samples.length} selected samples are also closely related to ${data.unselected_samples_in_cluster.length} other sample(s). Together, they form a "genomic cluster."`
        }`}
      </h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        {`Your selected samples are separated from each other by
        ${data.muts_bn_selected_minmax[0]} - ${
          data.muts_bn_selected_minmax[1]
        } mutations (or,
        on average, about ${
          data.muts_bn_selected_minmax[0] * data.muts_per_trans_minmax[0]
        } - 
        ${
          data.muts_bn_selected_minmax[1] * data.muts_per_trans_minmax[1]
        } transmission
        events).`}
      </p>
      <p>
        {` 
        ${
          data.unselected_samples_in_cluster.length == 0
            ? `These samples form their own genomic cluster.`
            : `The genomic cluster containing your samples also includes ${data.unselected_samples_in_cluster.length} samples from these locations: ${locations}.`
        }
        Here, "genomic cluster" means the smallest subtree (or "clade") that contains all of your samples. You can also think of this as the shortest plausible transmission chain connecting your samples to each other.`}
      </p>
    </div>
  );
}

export default ClusterDefinition;
