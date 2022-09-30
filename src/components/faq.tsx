import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useWindowWidth } from "@react-hook/window-size";
import { ROUTES } from "src/routes";
import { Link } from "react-router-dom";

export const FAQ = () => {
  const windowWidth = useWindowWidth();
  const contentWidth = Math.max(windowWidth / 2, 500);

  return (
    <div
      style={{
        width: contentWidth,
        position: "relative",
        margin: "auto",
        paddingBottom: 50,
      }}
    >
      <h1>Getting Started & FAQs</h1>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3>Data interpretation is nuanced; why should I trust Galago?</h3>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            We fully agree! That's why we've been very careful to only include
            observations in Galago that are <i>definitionally</i> true -- that
            is, they are based on objective, deterministic observations of the
            phylogenetic tree. With the exception of the clustering algorithms,
            there are no models running behind the scenes (which is why you
            won't find any predictions or recommendations in Galago). Check out
            our <Link to={ROUTES.METHODS}>Methods Page</Link> for more
            information about how we make these observations.
          </p>
          <p>
            Throughout the text, we also call out explicitly where there are
            potential alternative interpretations or sources of uncertainty.
            That said, we also recognize that no interpretative tool is perfect.
            That's why we believe so strongly in the importance of keeping
            Galago open-source: so the scientific community can contribute to
            these reports as a living document through a process of continual
            peer-review. We'd love to hear from you if you'd like to contribute
            or start a discussion! (See below for details on how to get
            started).
          </p>
        </AccordionDetails>
      </Accordion>

      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3>Is Galago really pathogen agnostic?</h3>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            Yes, so long as the following conditions are true:
            <ul>
              <li>
                <b>
                  You can reliably estimate the expected number of mutations per
                  transmission.
                </b>{" "}
                Don't worry -- we have provided default values for many common
                pathogens. For other pathogens, we also provide a handy
                calculator that can help you estimate this during upload. For
                the calculator, you will need to know the serial interval,
                genome length, and average substitution rate of your pathogen
                (these variables are usually readily available in the
                literature). If you need help with this, please get in touch --
                we're happy to help you find these values and then store them as
                defaults for other users to benefit from.
              </li>
              <br />
              <li>
                <b>There is no structural variation or recombination</b> in the
                pathogen genomes used to create the tree. For most pathogens,
                this isn’t usually an issue on outbreak timescales (days -
                months), but there are exceptions; please consult with whomever
                generated your phylogenetic tree for more information.
              </li>
            </ul>
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3>What are Galago's requirements for phylogenetic trees?</h3>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            <ol>
              <li>
                <h4>Format: </h4>
                We currently only accept trees uploaded in{" "}
                <a href="https://docs.nextstrain.org/en/latest/reference/data-formats.html">
                  <b>Nextstrain’s JSON format</b>
                </a>
                because this contains the metadata specified below and is
                consistent with most genomic epi pipelines (if you’d like to
                suggest another format, please let us know).
              </li>
              <li>
                <h4>Sequence type: </h4>
                Samples in the tree should represent{" "}
                <b>pathogen genomic sequences (one sample per case)</b>.
              </li>
              <li>
                <h4>Quality Control: </h4>
                Samples should be QC'd before you build your tree (upstream of
                Galago) -- because Galago only sees the tree, we can't comment
                on any potential QC issues with the underlying samples (e.g.,
                contamination). We recommend{" "}
                <a href="https://clades.nextstrain.org/">Nextclade</a> for QC of
                viral genomes.
              </li>
              <li>
                <h4>Metadata: </h4>
                Each sample in the tree should be labeled with the{" "}
                <b>location and date of collection</b>, following{" "}
                <a href="https://docs.nextstrain.org/en/latest/reference/data-formats.html">
                  Nextstrain’s schema
                </a>
                .
              </li>
              <li>
                <h4>
                  Branch lengths are in units of substitutions per genome
                  ("mutations")
                </h4>
                Sometimes phylogenetics pipelines will return branch lengths in
                units of "substitutions per site" instead of in "substitutions
                per genome." If this is an issue for you, please get in touch;
                we're considering adding an auto-conversion feature in the near
                future.
              </li>
            </ol>
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3>How do I generate a phylogenetic tree in JSON format?</h3>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            You can build a quick, approximate tree for SARS-CoV-2 or monkeypox
            samples using{" "}
            <a href="https://genome.ucsc.edu/cgi-bin/hgPhyloPlace">USHeR</a>.
            For other pathogens, you can use Nextstrain's{" "}
            <a href="https://docs.nextstrain.org/projects/augur/en/stable/index.html">
              augur
            </a>{" "}
            package to generate a tree using the command line.
            <br />
            <br />
            You can also use <a href="https://czgenepi.org/">CZ GEN EPI</a> to
            generate either or both of these types of trees. CZ GEN EPI is free
            and open-source.
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3>What are Galago's requirements for metadata files?</h3>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            <ol>
              <li>
                <h4>File format: </h4>
                Metadata must be in a CSV or TSV format;{" "}
                <a href="https://www.youtube.com/watch?v=FG_dsDvBSEM">
                  see this tutorial
                </a>{" "}
                on how to export data from excel in a compatible format.
              </li>
              <li>
                <h4>Sample names: </h4>
                One column must match the sample names in the tree; if you are
                using CZ GEN EPI to generate your tree, you can download a
                template by clicking "Download" and then "Private IDs (tsv)".
                Rows that do not match a sample name in your tree will be
                discarded.
              </li>
              <li>
                <h4>Data types and format: </h4>
                We only keep columns that are <b>text, dates, or numbers</b>.
                <br />
                We discard values that contain special characters, and expect{" "}
                <b>one value per cell</b>.
              </li>
              <li>
                <h4>Categorical values: </h4>
                For categorical values (i.e., text) there must be{" "}
                <b>no more than 100 unique values </b>
                in the file (e.g., 100 unique locations, facility codes, etc).
                Columns with more than 100 unique values will be discarded.
              </li>
            </ol>
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3>
            My data is sensitive! How can I be sure it is secure to use Galago?
          </h3>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            Galago never stores or sends your data anywhere beyond your local
            computer and web browser. Galago's architecture was designed with a
            "privacy-first" mindset, such that it doesn't even have the{" "}
            <i>ability</i> to store or send data. If you'd like, you're also
            welcome to use Galago offline by loading the home page and then
            turning off your internet.
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3>I have a bug report, idea or question! How do I let you know?</h3>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            We would <i>love</i> to hear from you! We rely on user feedback to
            improve Galago for everyone, and we read take every message
            seriously. For general questions, you can either head over to the{" "}
            <a href="https://github.com/chanzuckerberg/galago/discussions">
              discussion board
            </a>{" "}
            or send us an <a href="mailto:galago@chanzuckerberg.com">email</a>.
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3>
            I want to contribute to Galago's content or code; where do I start?
          </h3>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            Hooray! You can head over to our contributing docs{" "}
            <a href="https://github.com/chanzuckerberg/galago/blob/main/CONTRIBUTING.md">
              here
            </a>
            .
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3>What's next on your roadmap?</h3>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            Galago is currently in beta testing, so right now we're focused on
            learning from you, our users, and fixing any bugs that may come up.
            In the future, we're considering adding features like:
            <ul>
              <li>Export to PDF</li>
              <li>
                Enabling you to set the "verbosity" of the report to show more
                or less theory and detail.
              </li>
              <li>
                Weaving information from the metadata CSV into the report (e.g.,
                coloring visualizations by metadata).
              </li>
            </ul>
          </p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default FAQ;
