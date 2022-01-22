import { CladeDescription } from "../d";

// THIS KIND OF CARD DESCRIBES A CLADE
type DatasetProps = {
  data: { [key: string]: Node };
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function PhyloUncertainty(props: DatasetProps) {
  // const { data } = props;

  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "50em",
      }}
    >
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>{`How confident can we be in the phylogenetic tree underlying this report?`}</h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>{`[WIP] Something here about branch support and/or reversions`}</h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>
        {/* {`Write something here about the basic idea of what a tree is / how it groups together samples based on the number of mutations they share and allows us to assign approximate dates to specific cases and their upstream source infections....A tree represents the most likely hypothesis of the interrelated transmission chains that eventually resulted in the samples included in the datase. */}
        {`There are two main sources of error in phylogenetic trees:`}
      </p>
      <ol>
        <li>{`The quality of the sequence data coming in.`}</li>
        <li>{`Trees are sometimes confused by what are called _reversions_. That is, if a site in the genome changes from A -> T, and then later back from T -> A, it can be difficult to know which genotype was the original, which can cause samples to be placed in the wrong part of the tree.`}</li>
      </ol>
      <p>
        {`Add something here about how many reversions are in this part of the tree and what that means for interpretation. Eventually, also check for bootstrap values and say something about them if they exist. `}
      </p>
      <p>
        {`Eventually maybe add something or other about recombination, but probs OOS`}
      </p>
    </div>
  );
}

export default PhyloUncertainty;
