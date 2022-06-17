// @ts-nocheck
const overdispersed = clade_tree_proportion > 50;
const majority_unselected =
  clade_description.unselected_samples_in_cluster.length >
  clade_description.selected_samples.length;

{
  overdispersed && (
    <p>
      To include all of your selected samples, we have to "zoom out" and look at{" "}
      <FormatDataPoint value={`${clade_tree_proportion.toFixed(0)}%`} /> of the
      entire tree. This may indicate that your selected samples form multiple
      clusters in the tree.
    </p>
  );
}

{
  majority_unselected && (
    <p>
      Your selected samples make up less than half of the samples in this clade.
      If this was unexpected, one possible explanation is that your selected
      samples form multiple clusters in the tree.
    </p>
  );
}

{
  (overdispersed || majority_unselected) && (
    <p>
      We recommend{" "}
      <a href="https://auspice.us/">looking at your tree directly here</a>, and
      regenerating this report with the list of samples from each cluster
      separately. Or, if you'd still like to look at this large clade in its
      entirety, continue reading below.
    </p>
  );
}

export {};
