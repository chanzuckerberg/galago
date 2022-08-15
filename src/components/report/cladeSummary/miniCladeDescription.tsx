import { CladeDescription, Node } from "../../../d";
import { FormatDataPoint } from "../../formatters/dataPoint";
import { get_dist } from "../../../utils/treeMethods";
import { useSelector } from "react-redux";

export const MiniCladeDescription = () => {
  //@ts-ignore
  const state = useSelector((state) => state.global);

  const cladeDescription = state.cladeDescription;
  const monophyleticSamplesOfInterest =
    state.samplesOfInterest.length > 0 &&
    cladeDescription.unselected_samples_in_cluster.length == 0;
  const parentGrandparentDist = get_dist([
    cladeDescription.mrca,
    cladeDescription.parent_for_cousins,
  ]);
  const clade_unique =
    parentGrandparentDist > cladeDescription.muts_per_trans_minmax[1];

  let min_transmissions = "";
  if (cladeDescription.muts_per_trans_minmax[0] === 0) {
    min_transmissions = parentGrandparentDist > 0 ? "1" : "0";
  } else {
    min_transmissions = (
      parentGrandparentDist / cladeDescription.muts_per_trans_minmax[0]
    ).toFixed(0);
  }

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
            value={cladeDescription.selected_samples.length}
          />{" "}
          selected samples are also closely related to
          <FormatDataPoint
            value={cladeDescription.unselected_samples_in_cluster.length}
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
            value={`${min_transmissions} - ${(
              parentGrandparentDist /
              state.cladeDescription.muts_per_trans_minmax[1]
            ).toFixed(0)}`}
          />
          transmissions).
        </p>
      ) : (
        <p>
          This clade is quite similar to background circulation, and is only
          separated from its nearest neighbors by
          <FormatDataPoint value={parentGrandparentDist} /> mutations (~
          <FormatDataPoint
            value={`${min_transmissions} - ${(
              parentGrandparentDist /
              state.cladeDescription.muts_per_trans_minmax[1]
            ).toFixed(0)}`}
          />
          transmissions).
        </p>
      )}
    </div>
  );
};
