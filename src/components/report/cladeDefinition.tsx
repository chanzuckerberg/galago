import { CladeDescription, Node } from "../../d";
import Sidenote from "../formatters/sidenote";
import { FormatStringArray } from "../formatters/stringArray";
import { FormatDataPoint } from "../formatters/dataPoint";
import { useSelector } from "react-redux";
import { getNodeAttr } from "../../utils/treeMethods";
import { useWindowSize } from "@react-hook/window-size";
import { Heatmap } from "../viz/heatmap";

interface CladeDefinitionProps {}

function CladeDefinition(props: CladeDefinitionProps) {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const [windowWidth, windowHeight] = useWindowSize();

  const cladeDescription = state.cladeDescription;

  const all_samples = cladeDescription.selected_samples.concat(
    cladeDescription.unselected_samples_in_cluster
  );

  let localSamples = [];
  let maxMrcaDist = 0;
  Object.keys(cladeDescription.mrca_distances).forEach((sample) => {
    maxMrcaDist = Math.max(
      maxMrcaDist,
      cladeDescription.mrca_distances[sample]
    );
  });

  // TODO: soften geo requirement, use whatever resolution we have
  if (state.country && state.division && state.location) {
    localSamples = all_samples.filter(
      (n: Node) =>
        getNodeAttr(n, "country") === state.country &&
        getNodeAttr(n, "division") === state.division &&
        getNodeAttr(n, "location") === state.location
    );
  }

  // let lineage_counts = {};
  // cladeDescription.selected_samples.forEach((s) => {
  //   let lin = s.node_attrs.pango_lineage?.value;
  //   if (lin) {
  //     lineage_counts[lin] = 1 + (lineage_counts[lin] || 0);
  //   }
  // });

  return (
    <div className="reportSection">
      <h2>How closely related are your selected samples to each other?</h2>

      <p style={{ fontStyle: "italic" }}>
        Trees give us two ways to consider relatedness: mutations and
        hierarchical clustering.
      </p>
      <h5>Mutations:</h5>
      <p>
        We can use the average number of mutations per serial interval (
        {<FormatDataPoint value={`0 - ${state.mutsPerTransmissionMax}`} />}) to
        get a rough estimate of the number of transmissions separating two
        samples.
      </p>
      <div style={{ margin: "auto" }}>
        <Heatmap
          chartHeight={windowWidth * 0.35}
          chartWidth={windowWidth * 0.35}
          chartMargin={65}
        />
      </div>
      <h5>Hierarchical clustering ("clades"):</h5>
      <p>
        A 'clade' is a hierarchical cluster (or 'subtree') in a phylogenetic
        tree. By definition, all of the samples within a clade are more closely
        related to each other than they are to anything else in the dataset.
      </p>

      <p className="results">
        This clade contains{" "}
        {
          <FormatDataPoint
            value={
              cladeDescription.selected_samples.length +
              cladeDescription.unselected_samples_in_cluster.length
            }
          />
        }{" "}
        total samples.
        {/* if the user has specified samples of interest, give the makeup of 'interesting' vs 'other' samples in this clade */}
        {cladeDescription.selected_samples && // we have samples of interest -- and no other samples -- in this clade
          !cladeDescription.unselected_samples_in_cluster &&
          ` Your samples of interest form their own clade without any other samples from this dataset.`}
        {cladeDescription.selected_samples && // mix of both samples of interest and other samples in this clade
          cladeDescription.unselected_samples_in_cluster && (
            <>
              {" "}
              This includes
              {
                <FormatDataPoint
                  value={cladeDescription.selected_samples.length}
                />
              }{" "}
              of your samples of interest and
              {
                <FormatDataPoint
                  value={cladeDescription.unselected_samples_in_cluster.length}
                />
              }{" "}
              other samples.
            </>
          )}
      </p>

      <p className="results">
        The samples in this clade are from these locations:
        <FormatStringArray
          values={cladeDescription.unselected_samples_in_cluster
            .concat(cladeDescription.selected_samples)
            .map((n: Node) => getNodeAttr(n, "location"))}
        />
        {localSamples.length > 0 && (
          <>
            The <FormatDataPoint value={localSamples.length} />
            samples from {state.location} are:
            <FormatStringArray values={localSamples.map((s: Node) => s.name)} />
          </>
        )}
      </p>
      <h5>Lineages ("variants")</h5>
      <p>
        <Sidenote
          target={`"Lineages" or "variants"`}
          contents={
            <span>
              <a href="https://cov-lineages.org/lineage_list.html">
                Learn more about these lineages.
              </a>
            </span>
          }
        />{" "}
        are special clades that the scientific community has decided to label
        for ease of discussion.{" "}
      </p>
      <p className="results">
        This clade contains samples that are part of these lineage(s):
        <FormatStringArray
          values={cladeDescription.selected_samples
            .concat(cladeDescription.unselected_samples_in_cluster)
            .map(
              (s: Node) =>
                s.node_attrs.pango_lineage?.value ||
                s.node_attrs.clade_membership?.value
            )}
        />
      </p>
    </div>
  );
}
export default CladeDefinition;
