import { CladeDescription, Node } from "../../d";
import { getNodeAttr, get_dist } from "../../utils/treeMethods";
import { FormatStringArray } from "../formatters/stringArray";
import { FormatDate } from "../formatters/date";
import { FormatDataPoint } from "../formatters/dataPoint";
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function CladeUniqueness() {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const cladeDescription = state.cladeDescription;

  //@ts-ignore
  const cousin_locations: Array<string> = [
    ...new Set(
      cladeDescription.cousins.map((a: Node) => getNodeAttr(a, "location"))
    ),
  ].sort();

  let local_cousins: Node[] = [];

  //TODO: soften geo requirement, use whatever data we have
  if (state.location) {
    local_cousins = cladeDescription.cousins.filter(
      (c: Node) =>
        getNodeAttr(c, "country") === state.country &&
        getNodeAttr(c, "division") === state.division &&
        getNodeAttr(c, "location") === state.location
    );
  }

  const local_cousin_dates: Array<Date> = local_cousins
    .map((a) => a.node_attrs.num_date.value)
    .sort((a, b) => a.getTime() - b.getTime());

  const parentGrandparentDist = get_dist([
    state.mrca,
    cladeDescription.parent_for_cousins,
  ]);

  const clade_unique = parentGrandparentDist > state.mutsPerTransmissionMax;

  return (
    <div className="reportSection">
      <h2>
        How similar or unique is this clade, relative to background community
        transmission?
      </h2>
      <Accordion elevation={1} disableGutters square>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ marginBottom: 0, paddingBottom: 0 }}
        >
          {clade_unique ? (
            <p className="resultsSummary">
              This clade is distinct from background circulation, and is
              separated from its nearest neighbors by at least{" "}
              <FormatDataPoint value={parentGrandparentDist} />
              mutations (
              <FormatDataPoint
                value={`~ ${(
                  parentGrandparentDist / state.mutsPerTransmissionMax
                ).toFixed(0)}`}
              />
              transmissions).
            </p>
          ) : (
            <p className="resultsSummary">
              This clade is quite similar to background circulation, and is only
              separated from its nearest neighbors by
              <FormatDataPoint value={parentGrandparentDist} /> mutations (
              <FormatDataPoint
                value={`~ ${(
                  parentGrandparentDist / state.mutsPerTransmissionMax
                ).toFixed(0)}`}
              />
              transmissions).
            </p>
          )}{" "}
        </AccordionSummary>
        <AccordionDetails>
          <p className="theory">
            Comparing the primary case for this clade with its closest relatives
            in the tree can help us identify whether we have selected the right
            scope for our investigation.
          </p>
          <p className="theory">
            If there are many inferred transmissions separating your clade of
            interest from its nearest relatives, this is a good indication that
            there are missing intermediate cases that have not been sampled
            and/or included in this dataset, and you may be looking at a partial
            picture.
          </p>
          <p className="theory">
            Conversely, if there are many samples that are closely related
            genetically, have overlapping timeframes, and are geographically
            co-located, you may want to consider expanding the scope of your
            investigation.
          </p>
          {state.location && local_cousins.length > 0 && (
            <p className="results">
              In this dataset, the samples most closely related to your clade of
              interest include <FormatDataPoint value={local_cousins.length} />{" "}
              other samples from{" "}
              <FormatDataPoint value={cladeDescription.home_geo.location} />,
              dated between <FormatDate date={local_cousin_dates[0]} /> and{" "}
              <FormatDate date={local_cousin_dates.slice(-1)[0]} />:{" "}
              <FormatStringArray values={local_cousins.map((s) => s.name)} />
            </p>
          )}
          {state.location &&
            cladeDescription.cousins.length - local_cousins.length > 1 && (
              <p className="results">
                There are also{" "}
                <FormatDataPoint
                  value={cladeDescription.cousins.length - local_cousins.length}
                />{" "}
                closely related samples from these locations:
                <FormatStringArray values={cousin_locations} />
              </p>
            )}
          {!state.location && (
            <p className="results">
              In this dataset, the samples most closely related to your clade of
              interest include{" "}
              <FormatDataPoint value={cladeDescription.cousins.length} /> other
              samples from these locations:{" "}
              <FormatStringArray values={cousin_locations} />
            </p>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default CladeUniqueness;
