import { CladeDescription } from "../d";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function Assumptions(props: CladeProps) {
  const { data } = props;
  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "50em",
      }}
    >
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>How much of this report depends on heuristics?</h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>
        {/*TODO: show muts from parent? or shortest path from sample in cluster -> nearest cousin?*/}
        {`Parameters and assumptions used in this report`}
      </h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>{`Soon, enable users to set these parameters themselves.`}</p>

      <p>
        {`Most of the data described in this report is strictly observational -- meaning that we aren't applying many heuristics to the data when generating these insights. However, there are a few places where we are making some heuristic assumptions:`}
      </p>
      <ul>
        <li>{`Min and max number of mutations per transmission: ${data.muts_bn_selected_minmax}. This determines the thresholds we use when estimating which samples most likely represent tertiary cases (onward transmission).`}</li>
        <li>
          {`Minimum number of mutations between the primary case of your genomic cluster and its parent: ${data.min_muts_to_parent}. This determines how narrowly or broadly we search for closely related samples ("cousins") `}
        </li>
      </ul>
    </div>
  );
}

export default Assumptions;
