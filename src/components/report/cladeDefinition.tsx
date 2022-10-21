import { CladeDescription, Node } from "../../d";
import Sidenote from "../formatters/sidenote";
import { FormatStringArray } from "../formatters/stringArray";
import { FormatDataPoint } from "../formatters/dataPoint";
import { useSelector } from "react-redux";
import { findPolytomies, getNodeAttr } from "../../utils/treeMethods";
import { useWindowSize } from "@react-hook/window-size";
import { Heatmap } from "../viz/heatmap";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

  const polytomies = findPolytomies(state.mrca);
  const polytomySampleCount = polytomies.reduce((acc, p) => acc + p.length, 0);

  const lineages = cladeDescription.selected_samples
    .concat(cladeDescription.unselected_samples_in_cluster)
    .map(
      (s: Node) =>
        s.node_attrs.pango_lineage?.value ||
        s.node_attrs.clade_membership?.value
    )
    .filter((l: string) => l !== undefined);

  return (
    <div className="reportSection">
      <h2>How closely related are these samples to each other?</h2>
      <Accordion elevation={1} disableGutters square>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ marginBottom: 0, paddingBottom: 0 }}
        >
          <p className="resultsSummary">
            {
              <>
                Samples differ from the primary case of this clade by up to
                <FormatDataPoint value={maxMrcaDist} /> mutations (~
                <FormatDataPoint
                  value={Math.max(
                    maxMrcaDist / state.mutsPerTransmissionMax
                  ).toFixed(0)}
                />{" "}
                transmissions).
              </>
            }
            {polytomies.length > 0 ? (
              <>
                {" "}
                There are <FormatDataPoint value={polytomies.length} /> group(s)
                of identical samples within this clade and{" "}
                <FormatDataPoint
                  value={all_samples.length - polytomySampleCount}
                />{" "}
                singleton samples.
              </>
            ) : (
              <> There are no identical samples in this clade.</>
            )}

            {lineages.length > 0 && (
              <>
                {" "}
                This clade contains samples from lineage(s):
                <FormatStringArray values={lineages} />
              </>
            )}
          </p>
        </AccordionSummary>
        <AccordionDetails>
          <p className="theory">
            Trees give us two ways to consider relatedness: mutations and
            hierarchical clustering.
          </p>
          <h5>Mutations:</h5>
          <p className="theory">
            We can use the average number of mutations per serial interval (
            {<FormatDataPoint value={`0 - ${state.mutsPerTransmissionMax}`} />})
            to get a rough estimate of the number of transmissions separating
            two samples.
          </p>
          <div style={{ margin: "auto" }}>
            <Heatmap
              chartHeight={windowWidth * 0.35}
              chartWidth={windowWidth * 0.35}
              chartMargin={65}
            />
          </div>
          <h5>Hierarchical clustering ("clades"):</h5>
          <p className="theory">
            A 'clade' is a hierarchical cluster (or 'subtree') in a phylogenetic
            tree. By definition, all of the samples within a clade are more
            closely related to each other than they are to anything else in the
            dataset.
          </p>

          <p className="results">
            The samples in this clade are:{" "}
            <FormatStringArray values={all_samples.map((s: Node) => s.name)} />
          </p>
          <p className="theory">
            You may also hear the term 'lineage' or 'variant' used to describe a
            clade. These are simply specific clades that the scientific
            community has decided to label for ease of discussion. These labels
            are sometimes -- but not always! -- assigned because they denote
            some change in biological, clinical or epidemiological function.
          </p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
export default CladeDefinition;
