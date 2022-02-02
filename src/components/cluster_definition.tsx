import { CladeDescription } from "../d";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function ClusterDefinition(props: CladeProps) {
  const { data } = props;
  const locations = data.unselected_samples_in_cluster.map(
    (a) => a.node_attrs.location.value
  );
  return (
    <div>
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>
        How closely related are your selected samples (to each other, or to
        other samples in the dataset)?{" "}
      </h4>
      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>
        {` 
        ${
          data.unselected_samples_in_cluster.length == 0 // TITLE CHANGES DEPENDING ON IF SAMPLES FORM A MONOPHYLETIC SUBCLADE
            ? `Your ${data.selected_samples.length} selected samples are all more closely related to each other than to anything else in this dataset and form their own "clade."`
            : `Your ${data.selected_samples.length} selected samples are also closely related to ${data.unselected_samples_in_cluster.length} other sample(s). Together, they form a "clade."`
        }`}
      </h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        {`Here, a "clade" means the smallest subtree that contains all of your samples. You can also think of this as a "genomic cluster," wherein all the samples within the clade are more related to each other than they are to anything else in the dataset.`}
      </p>
      {/* //TODO: make this into a table */}
      <p>{`${
        data.unselected_samples_in_cluster.length == 0
          ? `Your selected samples form their own clade without any other samples from this dataset.`
          : `The clade containing your samples also includes ${data.unselected_samples_in_cluster.length} samples from these locations: ${locations}.`
      }`}</p>
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
        Learn more about{" "}
        <a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#what-is-a-phylogenetic-tree">
          clades
        </a>{" "}
        and{" "}
        <a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#the-overlapping-timescales-of-pathogen-evolution-and-pathogen-transmission.">
          how mutations are related to transmission events.
        </a>
      </p>
    </div>
  );
}

export default ClusterDefinition;
