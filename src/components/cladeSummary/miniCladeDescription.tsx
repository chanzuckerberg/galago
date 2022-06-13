import { CladeDescription, Node } from "../../d";
import { FormatDataPoint } from "../formatters/dataPoint";
import { get_dist } from "../../utils/treeMethods";
import { useSelector } from "react-redux";

export const MiniCladeDescription = () => {
  const state = useSelector((state) => state.global);

  const clade_description = state.cladeDescription;
  const monophyleticSamplesOfInterest =
    state.samplesOfInterest.length > 0 &&
    clade_description.unselected_samples_in_cluster.length == 0;
  const parentGrandparentDist = get_dist([
    clade_description.mrca,
    clade_description.parent_for_cousins,
  ]);
  const clade_unique =
    parentGrandparentDist > clade_description.muts_per_trans_minmax[1];
  // const closest_cousin_dist: number = Math.min(
  //   ...clade_description.cousins.map((c: Node) =>
  //     get_dist([c, clade_description.mrca])
  //   )
  // );

  return (
    // If they have samples of interest, describe the degree of overlap with their selected clade
    <div className="results">
      {monophyleticSamplesOfInterest && (
        <p>
          Your samples of interest are more closely related to each other than
          to anything else, and form their own clade without any other samples
          from this dataset.
        </p>
      )}
      {!monophyleticSamplesOfInterest && state.samplesOfInterest.length > 0 && (
        <p>
          Your
          <FormatDataPoint
            value={clade_description.selected_samples.length}
          />{" "}
          selected samples are also closely related to
          <FormatDataPoint
            value={clade_description.unselected_samples_in_cluster.length}
          />{" "}
          other samples in this dataset.
        </p>
      )}

      {clade_unique ? (
        <p>
          This clade is distinct from background circulation, and is separated
          from its nearest neighbors by at least{" "}
          <FormatDataPoint value={parentGrandparentDist} />
          mutations (~
          <FormatDataPoint
            value={`${1} - ${
              parentGrandparentDist *
              state.cladeDescription.muts_per_trans_minmax[1]
            }`}
          />
          transmissions).
        </p>
      ) : (
        <p>
          This clade is quite similar to background circulation, and is only
          separated from its nearest neighbors by
          <FormatDataPoint value={parentGrandparentDist} /> mutations (~
          <FormatDataPoint
            value={`${parentGrandparentDist * 1} - ${
              parentGrandparentDist *
              state.cladeDescription.muts_per_trans_minmax[1]
            }`}
          />
          transmissions).
        </p>
      )}
    </div>
  );
};
