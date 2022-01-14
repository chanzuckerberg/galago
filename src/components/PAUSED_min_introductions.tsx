import { CladeDescription } from "../d";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function MinIntroductions(props: CladeProps) {
  const { data } = props;

  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "50em",
      }}
    >
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>How many introductions contributed to this genomic cluster?</h4>
      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      {/* TITLE CHANGES DEPENDING ON IF SAMPLES FORM A GEOGRAPHICALLY MONOPHYLETIC SUBCLADE */}
      <h2>
        {` 
        ${
          data.geo_monophyletic
            ? `It is plausible that these samples were the result of a single introduction to ${data.geo_attr_val}.`
            : `At least ${data.min_transmissions_across_demes} introduction(s) from ${data.introductions_source_locations} contributed to this genomic cluster.`
        }
        `}
      </h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        {`
        ${
          data.geo_monophyletic
            ? `All of the samples in this cluster are from the same ${data.geo_attr}, meaning that we do not see evidence of multiple introductions to ${data.geo_attr_val}. Thus, it is plausible that this cluster is the result of a single introduction, followed by local spread. The strength of this evidence depends on how compete your dataset is (see above).`
            : `There are samples from ${data.introductions_source_locations} that are both upstream of (ancestral to) and within your genomic cluster, which indicates that at least ${data.min_transmissions_across_demes} introduction(s) to ${data.geo_attr_val} contributed to this genomic cluster. <TODO: insert table here with columns for ${data.geo_attr_val}, size of resulting introduction and date range for introduction>`
        }
        `}
      </p>
    </div>
  );
}

export default MinIntroductions;
