import { FormatDate } from "../formatters/date";
import { FormatDataPoint } from "../formatters/dataPoint";
import { EpiCurve } from "../viz/epiCurve";
import { getNodeAttr } from "../../utils/treeMethods";
import { useSelector } from "react-redux";
import ContingencyTable from "../viz/contingencyTable";
import { useWindowSize } from "@react-hook/window-size";
import Sidenote from "../formatters/sidenote";
import Theme from "../../theme";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getDateRange } from "src/utils/dates";
import { Node } from "src/d";
import { FormatStringArray } from "src/components/formatters/stringArray";

export const SitStat = () => {
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const cladeDescription = state.cladeDescription;
  const all_samples: Node[] = cladeDescription.selected_samples.concat(
    cladeDescription.unselected_samples_in_cluster
  );
  const [windowWidth, windowHeight] = useWindowSize();

  const sampleDateRange = getDateRange(
    all_samples.map((s: Node) => getNodeAttr(s, "num_date"))
  );

  return (
    <div>
      <h2>Genomic situation status</h2>
      <Accordion disableGutters square>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div>
            <EpiCurve
              chartHeight={windowWidth * 0.15}
              chartWidth={windowWidth * 0.35}
              chartMargin={60}
            />
            {!isNaN(getNodeAttr(state.mrca, "num_date")) && (
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  color: Theme.palette.primary.main,
                }}
              >
                * The primary case most likely existed around{" "}
                <FormatDate date={state.mrca.node_attrs.num_date.value} />{" "}
              </span>
            )}
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <p className="resultsSummary">
            {cladeDescription.selected_samples.length > 0 ? (
              <>
                This clade contains{" "}
                <FormatDataPoint
                  value={cladeDescription.selected_samples.length}
                />
                of your samples of interest and{" "}
                <FormatDataPoint
                  value={cladeDescription.unselected_samples_in_cluster.length}
                />
                other sample(s),
              </>
            ) : (
              <>This clade contains {all_samples.length} samples,</>
            )}{" "}
            collected between <FormatDate date={sampleDateRange.minDate} /> and{" "}
            <FormatDate date={sampleDateRange.maxDate} /> from these
            location(s):{" "}
            <FormatStringArray
              values={all_samples.map((s: Node) => getNodeAttr(s, "location"))}
            />
          </p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
