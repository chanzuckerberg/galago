import { CladeDescription, Node } from "../../d";
import { FormatDataPoint } from "../formatters/dataPoint";
import { get_dist } from "../../utils/treeMethods";
type miniCladeDescriptionProps = {
  clade_description: CladeDescription;
  clade_tree_proportion: number;
};

export const MiniCladeDescription = (props: miniCladeDescriptionProps) => {
  const { clade_description, clade_tree_proportion } = props;
  const comprehensive =
    clade_description.unselected_samples_in_cluster.length == 0;
  const overdispersed = clade_tree_proportion > 50;
  const majority_unselected =
    clade_description.unselected_samples_in_cluster.length >
    clade_description.selected_samples.length;
  const clade_unique =
    get_dist([clade_description.mrca, clade_description.parent_for_cousins]) >=
    clade_description.muts_per_trans_minmax[1] + 1;

  const closest_cousin_dist: number = Math.min(
    ...clade_description.cousins.map((c: Node) =>
      get_dist([c, clade_description.mrca])
    )
  );

  return (
    <div className="results">
      {comprehensive ? (
        <p className="results">
          Your selected samples are more closely related to each other than to
          anything else, and form their own clade without any other samples from
          this dataset.
        </p>
      ) : (
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

      {!overdispersed &&
        !majority_unselected &&
        (clade_unique ? (
          <p>
            This clade is distinct from background circulation, and is separated
            from its nearest neighbors by at least{" "}
            <FormatDataPoint value={closest_cousin_dist} />
            mutations.
          </p>
        ) : (
          <p>
            This clade is quite similar to background circulation, and is only
            separated from its nearest neighbors by
            <FormatDataPoint value={closest_cousin_dist} /> mutations.
          </p>
        ))}

      {overdispersed && (
        <p>
          To include all of your selected samples, we have to "zoom out" and
          look at{" "}
          <FormatDataPoint value={`${clade_tree_proportion.toFixed(0)}%`} /> of
          the entire tree. This may indicate that your selected samples form
          multiple clusters in the tree.
        </p>
      )}

      {majority_unselected && (
        <p>
          Your selected samples make up less than half of the samples in this
          clade. If this was unexpected, one possible explanation is that your
          selected samples form multiple clusters in the tree.
        </p>
      )}

      {(overdispersed || majority_unselected) && (
        <p>
          We recommend{" "}
          <a href="https://auspice.us/">looking at your tree directly here</a>,
          and regenerating this report with the list of samples from each
          cluster separately. Or, if you'd still like to look at this large
          clade in its entirety, continue reading below.
        </p>
      )}
    </div>
  );
};
