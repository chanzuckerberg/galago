import { Node } from "../../d";
import { get_dist } from "../../utils/treeMethods";
import Sidenote from "../formatters/sidenote";
import { FormatDataPoint } from "../formatters/dataPoint";
import { FormatStringArray } from "../formatters/stringArray";
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type OnwardTransmissionProps = {};

function OnwardTransmission(props: OnwardTransmissionProps) {
  //@ts-ignore
  const state = useSelector((state) => state.global);

  const cladeDescription = state.cladeDescription;
  const all_clade_samples: Node[] = cladeDescription.selected_samples.concat(
    cladeDescription.unselected_samples_in_cluster
  );

  const tertiary_cases: string[] = all_clade_samples
    .filter((x) => get_dist([x, state.mrca]) > state.mutsPerTransmissionMax * 2)
    .map((x) => x.name);

  return (
    <div className="reportSection">
      <h2>How much onward transmission have we observed?</h2>

      <Accordion elevation={1} disableGutters square>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ marginBottom: 0, paddingBottom: 0 }}
        >
          <p className="resultsSummary">
            {tertiary_cases.length > 0 ? (
              <>
                In this clade,
                <FormatDataPoint value={tertiary_cases.length} /> sample(s)
                likely represent onward transmission.
              </>
            ) : (
              <>
                No samples in this clade likely represent onward transmission.
              </>
            )}
          </p>
        </AccordionSummary>
        <AccordionDetails>
          <p className="theory">
            Differentiating between a superspreader event (where one primary
            case transmits to multiple secondary cases) and onward transmission
            (here, defined as 3 or more transmissions away from the primary
            case),{" "}
            <Sidenote
              target={"can be tricky"}
              contents={
                <span>
                  <a href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#how-many-mutations-are-enough-to-rule-linkage-out">
                    Learn more about ruling out direct linkage
                  </a>{" "}
                  and{" "}
                  <a href="https://alliblk.github.io/genepi-book/broad-use-cases-for-genomic-epidemiology.html#assessing-linkage-between-cases">
                    more generally assessing linkage patterns between cases.
                  </a>
                </span>
              }
            />
            .
          </p>
          <p className="theory">
            An infected case may have multiple pathogen genotypes present in
            their body, generated as the pathogen replicates. This means that
            sometimes you may observe a few different genotypes which vary by
            <FormatDataPoint value={`0 - ${state.mutsPerTransmissionMax}`} />
            mutations being transmitted to secondary cases during the same
            superspreader event.
          </p>
          <p className="theory">
            It's usually reasonable to assume that samples with
            <FormatDataPoint value={state.mutsPerTransmissionMax * 2 + 1} />+
            mutations are at least 3+ downstream transmissions away from the
            primary case.
          </p>

          {tertiary_cases.length > 0 && (
            <p className="results">
              These sample(s) likely represent onward transmission:
              <FormatStringArray values={tertiary_cases} />
            </p>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default OnwardTransmission;
