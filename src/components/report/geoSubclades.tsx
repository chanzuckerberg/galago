import { CladeDescription } from "../../d";
import { FormatDataPoint } from "../formatters/dataPoint";
import { FormatStringArray } from "../formatters/stringArray";
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function GeoSublades() {
  //@ts-ignore
  const state = useSelector((state) => state.global);

  const cladeDescription = state.cladeDescription;

  const no_data =
    cladeDescription.subclade_geo === undefined ||
    cladeDescription.subclades === undefined;
  if (no_data) {
    return null;
  }

  const geo_monophyletic =
    cladeDescription.subclade_geo && cladeDescription.subclades.length === 0;

  const subclade_locations =
    cladeDescription.subclades.length > 0 &&
    typeof cladeDescription.subclade_geo === "string"
      ? cladeDescription.subclades.map(
          //@ts-ignore - we've already excluded the case where subclade_geo is null on line 10
          (s) => s.node_attrs[cladeDescription.subclade_geo]["value"]
        )
      : [];

  return (
    <div className="reportSection">
      <h2>
        Has transmission between geographic areas contributed to this clade?
      </h2>

      <Accordion elevation={1} disableGutters square>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ marginBottom: 0, paddingBottom: 0 }}
        >
          {geo_monophyletic ? (
            <p className="resultsSummary">
              All of the samples in this clade are from the same{" "}
              <FormatDataPoint value={cladeDescription.subclade_geo} />
              -- it is plausible that these samples were all the result of a
              single introduction, followed by local spread.
            </p>
          ) : (
            <p className="resultsSummary">
              At least{" "}
              <FormatDataPoint value={cladeDescription.subclades.length} />{" "}
              separate introductions to
              <FormatDataPoint
                value={state[cladeDescription.subclade_geo]}
              />{" "}
              have contributed to this clade.
            </p>
          )}
        </AccordionSummary>

        <AccordionDetails>
          <p className="theory">
            By overlaying the geographic location of samples with the
            hierarchical clustering from the tree, we can infer the minimum
            number of transmissions between locations that have contributed to
            your clade of interest.
          </p>

          <p className="results">
            {/* {no_data &&
          "While there are samples within your clade from other locations, we aren't able to report on specific transmissions between locations because this was not inferred by Nextstrain upstream."} */}

            {!no_data && geo_monophyletic && (
              <>
                All of the samples in this clade are from the same{" "}
                <FormatDataPoint value={cladeDescription.subclade_geo} />; we do
                not see evidence of multiple introductions to{" "}
                <FormatDataPoint
                  //@ts-ignore
                  value={
                    cladeDescription.home_geo[cladeDescription.subclade_geo]
                  }
                />
                <br />
                <br />
                Thus, it is plausible that these samples were all the result of
                a single introduction, followed by local spread.
              </>
            )}

            {!no_data && !geo_monophyletic && (
              <>
                At least{" "}
                <FormatDataPoint value={cladeDescription.subclades.length} />{" "}
                transmission(s) between{" "}
                <FormatDataPoint
                  value={
                    //@ts-ignore
                    cladeDescription["home_geo"][cladeDescription.subclade_geo]
                  }
                />{" "}
                and these locations have contributed to this clade:{" "}
                <FormatStringArray values={subclade_locations} />
              </>
            )}
          </p>
          <p>
            As always, the strength of this evidence depends on how
            representative your dataset is (see below).
          </p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default GeoSublades;
