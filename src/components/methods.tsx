import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useWindowWidth } from "@react-hook/window-size";

export const Methods = () => {
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
      <h1>Glossary & Methods</h1>
      <p style={{ fontStyle: "italic" }}>
        Most of the information in Galago reports is based purely on definitions
        -- that is, they are observations, rather than inferences; below, we've
        defined what each of these terms means in the context of a Galago
        report. For the few pieces of data that are inferred or estimated, we
        describe those methods as part of the definition.
      </p>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 id="branch-lengths-hierarchical-cluster">
            Branch lengths & hierarchical clusters
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <p>A phylogenetic tree consists of two things:</p>
          <ul>
            <li>
              <b>Hierarchical clusters</b> describe the relationship between
              samples and groups of samples. Any internal node in the tree can
              be used to define a hierarchical cluster, which contains all of
              the samples that directly or eventually descend from that node.
              <br />
              Importantly, this means that any given sample is likely part of
              many possible hierarchical clusters (e.g., the cluster defined by
              its direct parent, its grandparent, its great-grandparent, etc.)
              ranging from small groups of samples to the entire tree.
            </li>
            <br />

            <li>
              <b>Branch lengths</b> tell us how many mutations separate samples
              or groups of samples from one another (i.e., how similar or
              distinct they are).
            </li>
          </ul>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 id="clade">Clade</h2>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            A "clade" is another name for a hierarchical cluster in a
            phylogenetic tree (see above).
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 id="cousins">Cousins</h2>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            We use this term to help contextualize the hierarchical cluster
            you're investigating. That is, if we "zoomed out" to the
            next-largest parent cluster, which other samples would be included?
          </p>
          <p>
            You can think of this like your family tree -- if we "zoomed out"
            from your immediate family to the next-largest group in your family
            tree, we'd be looking at the group defined by your grandparents
            (i.e., all of your cousins).
          </p>
        </AccordionDetails>
      </Accordion>

      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 id="clustering-metadata">
            Clustering based on metadata (aka "ancestral state reconstruction")
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            Phylogenetic trees already represent hierarchical clustering (see
            above). Sometimes, though, it can be helpful to use metadata to help
            us identify which hierarchical clusters in the tree are important to
            look at; this process of suggesting relevant clades based on when
            metadata (e.g., location) changes is also commonly referred to as
            "clustering."
          </p>
          <p>
            Galago supports two "clustering" methods:{" "}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://academic.oup.com/ve/article/4/1/vex042/4794731"
            >
              TreeTime
            </a>{" "}
            and{" "}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://academic.oup.com/ve/article/8/1/veac048/6609172"
            >
              Introduction Weight Heuristic
            </a>
            . Both of these methods work by inferring the most likely metadata
            values for internal nodes, based on their children's metadata. These
            methods differ in how they make this inference. Treetime is a
            model-based method and is generally more robust, but takes longer to
            run. This is why treetime-based "clusters" must be computed upstream
            from Galago, usually as part of a Nextstrain run. The Introduction
            Weight Heuristic is a heuristic, rather than a model, meaning that
            it's somewhat less accurate, but is able to be run very quickly.
            This is why for some metadata fields, you may see Introduction
            Weight Heuristic enabled as a method, but not TreeTime (Introduction
            Weight Heuristic is so fast that we can run it on the spot within
            Galago).
          </p>
          <p>
            Once every node and sample in the tree has metadata assigned, the
            algorithm walks down the tree from the root to the samples and notes
            where metadata values change along the way (i.e., which hierarchical
            clusters represent a new value compared to their parents). For
            example, if the metadata you're using is "U.S. state," then each of
            these suggested "clusters" represents an introduction of the
            pathogen from one state to another.
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 id="mutations">Mutations</h2>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            Mutations are genetic differences between two samples, where one
            mutation = one base, or site, in the genome that differs.
          </p>
          <p>
            We estimate the number of mutations between nodes / samples in the
            tree based on patristic distances. Patristic distances are
            calculated by tracing the path between two samples / nodes and
            adding up the branch lengths that separate them in the tree. We use
            this method instead of raw SNP counts because patristic distances
            can be estimated directly from the tree, while SNP counts require a
            separate alignment file. These two metrics should be identical or
            very close to each other (remember that we expect uploaded trees to
            have branch lengths specified in units of mutations, not
            substitutions per site).
          </p>
          <p>
            <i>
              Note: there is a nuanced difference between "mutations" and
              "substitutions," but this is outside the scope of this guide. We
              use these terms interchangeably.
            </i>
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 id="mutation-rate">
            Mutation rate (aka "evolutionary clock rate")
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            The pathogen-specific average number of mutations per unit of time.
            You can see this for many pathogens on Nextstrain by going to the
            "clock" view.
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 id="mutations-per-transmission">Mutations per transmission</h2>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            {`Throughout the application, we convert between the number of mutations and the number of transmissions using a threshold. We choose this threshold such that the P(N or more mutations between cases | cases are directly linked) is < 10%.`}
            We{" "}
            <a
              target="_blank"
              href="https://github.com/chanzuckerberg/galago/blob/main/src/utils/pathogenParameters.ts#L82"
            >
              estimate
            </a>{" "}
            this threshold using the poisson cumulative density function, where
            lambda is the average number of mutations per serial interval.
            Importantly, this value can be quite variable based on the
            epidemiological setting, which is why we always provide a range.
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 id="primary-case">
            Primary case (aka "most recent common ancestor (MRCA)")
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            Internal nodes in the tree represent inferred upstream cases which
            were the predecessors to samples at the tips of the tree. Each
            hierarchical cluster in the tree is defined by an internal node, or
            the "most recent common ancestor." The literal interpretation in
            epidemiological terms is that this internal node, as the predecessor
            to all of the sampled cases in the cluster, is the "primary case" of
            this cluster.
          </p>
          There are three important caveats to this designation:
          <ol>
            <li>
              If the pathogen is spreading faster than it is mutating, there may
              be multiple samples that match the primary case.
            </li>
            <br />
            <li>
              The true primary case may be an unsampled case (see the note on
              'sampling bias' below).
            </li>
            <br />
            <li>
              Because of within-host pathogen diversity, it's possible that
              there are multiple pathogen genotypes that could represent the
              primary case.
            </li>
          </ol>
          See this section in the Applied Genomic Epidemiology Handbook{" "}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#the-transmission-tree-does-not-equate-the-phylogenetic-tree."
          >
            on the relationship between the phylogenetic tree and the
            transmission tree
          </a>
          , and this section on{" "}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#viral-diversity-accumulates-over-the-course-of-a-single-individuals-infection."
          >
            within-host pathogen diversity
          </a>{" "}
          , to learn more.
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 id="secondary-tertiary-cases">
            Secondary & tertiary cases and onward transmission
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          We compare each sample in your hierarchical cluster of interest to the
          inferred primary case (above) and use the number of mutations between
          them to estimate the number of transmission events that have occurred
          between the primary case and each sample (based on the average number
          of mutations per transmission, above).
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 id="sampling-bias">Sampling bias</h2>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            Phylogenetic trees represent the most likely hypothesis for how
            samples are related to one another genetically. Importantly, though,
            the tree does not account for unsampled or unsequenced cases; if
            your tree does not include sufficient background contextual data, it
            can be easy to be misled. See{" "}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://alliblk.github.io/genepi-book/sample-selection.html#contextual-data"
            >
              this section in the Applied Genomic Epidemiology Handbook
            </a>{" "}
            for more information.
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion id="faq-data-interpretation">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 id="tmrca">
            Time to Most Recent Common Ancestor (TMRCA) for dating outbreaks
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            Because pathogens evolve at a consistent rate, we can estimate the
            date of the primary case based on the collection date of its
            children and the number of mutations between the primary case and
            its children. See{" "}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#mutation-rates-evolutionary-rates-and-the-molecular-clock"
            >
              this section in the Applied Genomic Epidemiology Handbook
            </a>{" "}
            to learn more.
          </p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Methods;
