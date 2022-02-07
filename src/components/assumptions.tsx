import { CladeDescription } from "../d";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function Assumptions(props: CladeProps) {
  const { data } = props;
  return (
    <div>
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h2>What assumptions influence this report?</h2>

      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        {`Most of the data and insights described in this report are strictly observational (meaning they don't depend on heuristics or "judgement calls"). However, there are a few exceptions:`}
      </p>
      <ul>
        <li>{`We assume that the number of mutations that occurs with each transmission ranges between ${data.muts_bn_selected_minmax[0]} - ${data.muts_bn_selected_minmax[1]}. This determines which samples are mostly likely from tertiary cases (onward transmission).`}</li>
        <li>
          {`When looking for "cousins" (samples that are outside your clade of interest but closely related), we look at all the samples that descend from a parent (or grandparent, etc) of the primary case of your clade. To select which grand/parent to look at (i.e., how narrowly or broadly we search for "cousins"), we choose the most recent parent that is separated from your clade's primary case by at least ${data.min_muts_to_parent} mutation(s).`}
        </li>
      </ul>
    </div>
  );
}

export default Assumptions;
