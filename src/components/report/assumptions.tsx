import Sidenote from "../formatters/sidenote";
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import { FormatDataPoint } from "../formatters/dataPoint";
import { ROUTES } from "src/routes";
import { Link } from "react-router-dom";

type AssumptionsProps = {
  sidenote_start: number;
};

function Assumptions(props: AssumptionsProps) {
  const { sidenote_start } = props;
  //@ts-ignore
  const state = useSelector((state) => state.global);
  const cladeDescription = state.cladeDescription;
  return (
    <div className="reportSection">
      <h2> What assumptions influence this report?</h2>
      <Accordion elevation={1} disableGutters square>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ marginBottom: 0, paddingBottom: 0 }}
        >
          <p className="resultsSummary">
            The data and insights described in this report are strictly
            observational (meaning they don't depend on heuristics or "judgement
            calls"). The most important parameter is the average number of
            mutations per transmission:{" "}
            <FormatDataPoint value={`0 - ${state.mutsPerTransmissionMax}`} />
          </p>
        </AccordionSummary>
        <AccordionDetails>
          <p className="theory">
            We{" "}
            <Sidenote
              target={`estimate`}
              contents={
                <Link
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{ color: "white" }}
                  to={ROUTES.METHODS}
                >
                  Methods
                </Link>
              }
            />{" "}
            the number of mutations per transmission based on the pathogen
            mutation rate, serial interval, and the poisson probability of
            observing more than N mutations between directly linked samples.
            This determines which samples are mostly likely from tertiary cases
            (onward transmission).
          </p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default Assumptions;
