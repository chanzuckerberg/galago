import { CladeDescription } from "../d";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function uncertainty(props: CladeProps) {
  // const { data } = props;

  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "50em",
      }}
    >
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>{`How confident can we be in this data?`}</h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>
        {`There are two main sources of error in this data: phylogenetic
        uncertainty and sampling bias`}
      </h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>{`Write something here about the basic idea of what a tree is / how it groups together samples based on the number of mutations they share and allows us to assign approximate dates to specific cases and their upstream source infections....A tree represents the most likely hypothesis of the interrelated transmission chains that eventually resulted in the samples included in the dataset.`}</p>
      <p>{`How reliable a tree is depends on three things: (1) Sampling - the tree can't account for samples it doesn't know exists, something here about the importance of representative sampling - see below. 
      (2) The quality of the sequence data coming in. E.g., if samples are contaminated or genomes are incomplete, this adds noise to the tree. 
      And (3) Trees are sometimes confused by what are called _reversions_. That is, if a site in the genome changes from A -> T, and then later back from T -> A, it can be difficult to know which genotype was the original, which can cause samples to be placed in the wrong part of the tree.`}</p>
    </div>
  );
}

export default uncertainty;
