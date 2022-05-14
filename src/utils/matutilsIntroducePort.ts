/* PARTIAL PORT OF MATUTILS INTRODUCE V0.5.3 WITH PERMISSION FROM RUSS CORBET & JACOB MCBROOME - THANK YOU! */

import { Node } from "../d";
import {
  getNodeAttr,
  traverse_postorder,
  traverse_preorder,
} from "./treeMethods";

// const getAssociationIndex = (tree: Node, trait: string, threshold: number = 0.5) => {
//     /*
//     The association index was introduced by Wang et al 2005 for the estimation of phylogeny and trait correlation. Parker et al 2008 has a good summary.
//     It's an index that is small for strong correlation and large for weak correlation, with non-integer values.
//     AI = sum(for all internal nodes) (1-tips_with_trait) / (2 ^ (total_tips - 1))
//     This can be calculated for a full tree or for an introduction-specific subtree.
//     [Jacob's] implementation is an efficient one that relies on dynamic programming and useful ordering of node traversal.
//     This searches over a reverse breadth first order. For each internal node, check the children.
//     Count the number of direct leaf children which are in/out and get the records for the counts for in/out
//     from the internal_tracker map. Add these up to get the total number of in/out leaves associated with a node.
//     This avoids repeatedly traversing the tree to identify leaves for each internal node, since reverse breadth-first search order
//     means that all children of a node will necessarily be traversed over before the node itself is.
//     */
//     let total_ai = 0.0
//     let internal_tracker: {[key: string]: any} = {}
//     let allNodes = traverse_preorder(tree).reverse() // do a reverse breadth-first search, collecting both nodes and leaves

//     for (let i = 0; i < allNodes.length; i++) {
//         let currentNode = allNodes[i]
//         if (currentNode.children.length > 0) { // for each internal node
//             let in_count = 0
//             let out_count = 0

//             for (let j = 0; j < currentNode.children.length; i++) { // look at each child
//                 let currentChild = currentNode.children[j]

//                 if (currentChild.children.length === 0) { // if the child is a leaf
//                     if (getNodeAttr(currentChild, trait) >= threshold) { // tally it as 'in' or 'out' based on its trait value
//                         in_count += 1
//                     } else {
//                         out_count += 1
//                     }
//                 } else { // if the child is an internal node, check to see that its counts have been recorded in the internal_tracker
//                     if (Object.keys(internal_tracker).includes(currentChild.name)) {
//                         in_count += internal_tracker[currentChild.name]['in'] // add counts from descendent internal nodes to current counts
//                         out_count += internal_tracker[currentChild.name]['out']
//                     } else {
//                             console.error('AI CALCULATION ENCOUNTERED MYSTERY INTERNAL CHILD', currentChild)
//                     }
//                 }
//             }
//              // once we've visited all the node's children, calculate AI and record our final counts
//             internal_tracker[currentNode.name] = {'in': in_count, 'out': out_count}
//             const total_leaves = in_count + out_count;
//             total_ai += (1 - in_count) / (2**(total_leaves-1));
//         }
//     }
//     return total_ai;
// }

// const getMonophyleticCladeSize = (subroot: Node, trait: string, threshold: number = 0.5) => {
//     /*
//     The monophyletic clade statistic was introduced by Salemi et al 2005. Parker et al 2008 has a good summary.
//     MC is bigger for strong correlations, bounded 1 to N where N is the number of samples in the subtree.
//     This is a simple qualifier which just searches across the subtree and identifies the largest clade which entirely and only contains IN samples.
//     My implementation accomplishes this by looking across the depth-first expansion of leaves only
//     and identifying the longest contiguous string of IN sample identifiers, which reflects the largest
//     clade subtree which is entirely IN.
//     */

//     // depth-first search, collecting only leaves
//     let allLeaves = traverse_postorder(subroot, (n: Node) => {n.children.length === 0})

//     let biggestSize = 0
//     let currentSize = 0

//     for (let i = 0; i<allLeaves.length; i++) { // for each leaf
//         let currentLeaf = allLeaves[i]
//         if (getNodeAttr(currentLeaf, trait) >= threshold) {
//             currentSize += 1 // if it is "in" +1 and keep going
//         } else { // if it's out, break the counter and record the biggest contiguous streak we've seen
//             if (currentSize > biggestSize) {
//                 biggestSize = currentSize
//             }
//             currentSize = 0
//         }
//     }

//     if (currentSize > biggestSize) {
//         biggestSize = currentSize;
//     }
//     return biggestSize;
// }

const recordAssignments = (
  n: Node,
  attr: string,
  confidence: number,
  attrValue: any
) => {
  /* WARNING: IMPURE FUNCTION */
  /* Updates node object IN PLACE with newly calculated confidence metric */

  if (confidence === 0) {
    return; // don't assign anything if we have no confidence
  }
  if (Object.keys(n.node_attrs).includes(attr)) {
    // has attribute
    if (typeof n.node_attrs[attr] === "object") {
      // attribute is a dictionary already
      if (Object.keys(n.node_attrs[attr]).includes("matutils_confidence")) {
        // if we already have a 'confidence' value recorded, only update it if the current assignment has higher confidence
        if (confidence > n.node_attrs[attr]["matutils_confidence"]) {
          n.node_attrs[attr]["matutils_value"] = attrValue;
          n.node_attrs[attr]["matutils_confidence"] = confidence;
        }
      } else {
        // if no 'confidence' value yet recorded, initiate with the current value
        n.node_attrs[attr]["matutils_value"] = attrValue;
        n.node_attrs[attr]["matutils_confidence"] = confidence;
      }
    } else {
      // has attribute, but is not yet a dictionary
      n.node_attrs[attr] = {
        value: n.node_attrs[attr], // record current value using nextstrain's default 'value' syntax
        matutils_value: attrValue, // record matutils value & confidence
        matutils_confidence: confidence,
      };
    }
  } else {
    // attribute not present
    n.node_attrs[attr] = {
      matutils_value: attrValue, // record matutils value & confidence
      matutils_confidence: confidence,
    };
  }
};

const calcHeuristic = (
  currentNode: Node,
  attr: string,
  attrValue: any,
  stored_intermediate_params: { [key: string]: any }
) => {
  /*
    This function applies a heuristic series of steps to label internal nodes as in or out of a geographic area
    based on their relationship to the samples in the input list. The rules are:
    1. If the node is a leaf, it is IN if it has a matching trait value, otherwise OUT
    2. If all descendents of the node are IN, its IN
    3. If all descendents of the node are OUT, its OUT
    4. Nodes are assigned the state which yields the minimum distance to the nearest leaf of that type divided by the total number of leaves of that type descended from it
    This last step is the most complex one, and is a weighted minimum which takes into account both the number of descendents and the total distance to those descendents
    It's worth noting that if a sample is an identical child to the internal node, that state will always win
    5. On a tie, the node is assigned to the state of its parent
    Introductions are identified as locations where assignments in an rsearch from an IN sample shift from IN to OUT.
    */

  //initialize placeholder values
  let in_leaves = 0;
  let out_leaves = 0;
  let min_to_in = 10000000;
  let min_to_out = 10000000;

  for (let j = 0; j < currentNode.children.length; j++) {
    // look at all children of the current node
    let currentChild = currentNode.children[j];

    if (currentChild.children.length > 0) {
      // if child is also an internal node, pull stored values and add them to cumulative values
      if (Object.keys(stored_intermediate_params).includes(currentChild.name)) {
        in_leaves += stored_intermediate_params[currentChild.name]["in_leaves"];
        out_leaves +=
          stored_intermediate_params[currentChild.name]["out_leaves"];

        const currentChildMinToIn =
          stored_intermediate_params[currentChild.name]["min_to_in"] +
          currentChild.branch_attrs["length"];

        const currentChildMinToOut =
          stored_intermediate_params[currentChild.name]["min_to_out"] +
          currentChild.branch_attrs["length"];

        if (currentChildMinToIn < min_to_in) {
          min_to_in = currentChildMinToIn;
        }
        if (currentChildMinToOut < min_to_out) {
          min_to_out = currentChildMinToOut;
        }
      } else {
        console.error(
          "traversal error in trait assignment heuristic calc",
          currentChild
        );
      }
    } else {
      // if leaf, check if it is 'in' (i.e., attribute value matches current query) and update cumulative values
      if (getNodeAttr(currentChild, attr) === attrValue) {
        in_leaves += 1;
        if (currentChild.branch_attrs["length"] < min_to_in) {
          min_to_in = currentChild.branch_attrs["length"];
        }
      } else {
        out_leaves += 1;
        if (currentChild.branch_attrs["length"] < min_to_out) {
          min_to_out = currentChild.branch_attrs["length"];
        }
      }
    }
  }
  // once we've visited every child, store our cumulative values
  stored_intermediate_params[currentNode.name] = {
    in_leaves: in_leaves,
    out_leaves: out_leaves,
    min_to_in: min_to_in,
    min_to_out: min_to_out,
  };

  // calculate confidence
  let confidence: number = NaN;
  if (out_leaves === 0) {
    // rule 2: if all descendent leaves are 'in', the node is 'in'
    confidence = 1;
  } else if (in_leaves === 0) {
    //rule 3: vice versa of rule 2
    confidence = 0;
  } else {
    // rule 4: we want to estimate the confidence we have in assignments for nodes with a mix of descendent states
    // we calculate the balance by computing C=1/(1+((OUT_MD/OUT_LEAVES)/(IN_MD/IN_LEAVES)))
    // C is near 0 when OUT is large, C is near 1 when IN is large, C is 0.5 when they are the same
    // now we complete rule 4 by checking the balance.
    if (min_to_in == 0) {
      //this calculation is unnecessary in these cases.
      //tiebreaker for both being 0 is IN with this ordering.
      //identical IN sample, its IN, because logically this ancestor did exist there at that time (just maybe elsewhere also)
      confidence = 1;
    } else if (min_to_out == 0) {
      confidence = 0;
    } else {
      const numerator = min_to_out / out_leaves;
      const denominator = min_to_in / in_leaves;
      const ratio = numerator / denominator;
      confidence = 1 / (1 + ratio);
    }
    if (isNaN(confidence)) {
      console.error(
        "ERROR: Invalid introduction assignment calculation. Debug information follows.\n",
        "min_to_in, min_to_out, in_leaves, out_leaves\n",
        min_to_in,
        min_to_out,
        in_leaves,
        out_leaves
      );
    }
  }
  return {
    confidence: confidence,
    stored_intermediate_params: stored_intermediate_params,
  };
};

export const assignInternalNodeTraits = (tree: Node, attr: string) => {
  /* WARNING: IMPURE FUNCTION - infers ancestral states for any arbitrary attribute and records this in the tree object in-place for memory and performance considerations */

  const allNodes = traverse_preorder(tree).reverse();
  const allValidAttrValues = allNodes.map((n: Node) => getNodeAttr(n, attr));
  // .filter((value: any) => {
  //   ["string", "number"].includes(typeof value);
  // });
  // });
  const uniqueAttrValues = new Set(allValidAttrValues);
  if (uniqueAttrValues.size < 2 || uniqueAttrValues.size > 100) {
    // poor man's error management - at least don't fall over
    console.log(
      "Not assigning values for trait ",
      attr,
      " because of the number of values: ",
      uniqueAttrValues.size
    );
    return;
  }

  uniqueAttrValues.forEach((attrValue: any) => {
    let stored_intermediate_params: { [key: string]: any } = {};
    let confidence = NaN;

    for (let i = 0; i < allNodes.length; i++) {
      let currentNode = allNodes[i];

      // Rule 1 - leaf is in/out based on if it has a matching trait value
      if (currentNode.children.length === 0) {
        const currentChildValue = getNodeAttr(currentNode, attr, "value");
        // tips have known values - confidence is 1 for whatever that value is
        recordAssignments(currentNode, attr, 1, currentChildValue);
        continue;
      } else {
        ({ stored_intermediate_params, confidence } = calcHeuristic(
          currentNode,
          attr,
          attrValue,
          stored_intermediate_params
        ));

        let previousAssignmentConfidence = getNodeAttr(
          currentNode,
          attr,
          "matutils_confidence"
        );
        if (previousAssignmentConfidence === confidence) {
          console.log("FOUND IDENTICAL CONFIDENCE VALUES", confidence);
          // INSERT SOME LOGIC HERE TO MATCH TO THE PARENT IF THERE IS A TIE... parent gets visited *after* children so might need to do a second pass through the tree??
        } else {
          recordAssignments(currentNode, attr, confidence, attrValue); // this fn checks to see if a prior confidence score exists and only overwrites if the current confidence score is greater
        }
      }
    }
  });
};

// if (eval_uncertainty) {
//     timer.Start();
//     fprintf(stderr, "Leaf label uncertainty estimate requested; calculating...\n");
//     //update the assignments for specific leaves against the rest of the dataset
//     for (auto l: T->get_leaves()) {
//         float total_conf = 0.0;
//         float max_conf = 0.0;
//         float traversed = static_cast<float>(l->mutations.size());
//         for (auto anc: T->rsearch(l->identifier, false)) {
//             float acv = assignments.find(anc->identifier)->second;
//             total_conf += (acv / ((1+traversed) * (1+traversed)));
//             max_conf += (1 / ((1+traversed) * (1+traversed)));
//             traversed += static_cast<float>(anc->mutations.size());
//         }
//         assignments[l->identifier] = total_conf / max_conf;
//     }
//     fprintf(stderr, "All leaves processed in %ld msec.\n", timer.Stop());
// }
