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
      <h2 className="reportSection" id="branch-lengths-hierarchical-cluster">
        Branch lengths & hierarchical clusters
      </h2>
      <p>A phylogenetic tree consists of two things:</p>
      <ul>
        <li>
          <b>Hierarchical clusters</b> describe the relationship between samples
          and groups of samples. Any internal node in the tree can be used to
          define a hierarchical cluster, which contains all of the samples that
          directly or eventually descend from that node.
          <br />
          Importantly, this means that any given sample is likely part of many
          possible hierarchical clusters (e.g., the cluster defined by its
          direct parent, its grandparent, its great-grandparent, etc.) ranging
          from small groups of samples to the entire tree.
        </li>
        <br />

        <li>
          <b>Branch lengths</b> tell us how many mutations separate samples or
          groups of samples from one another (i.e., how similar or distinct they
          are).
        </li>
      </ul>
      <h2 className="reportSection" id="clade">
        Clade
      </h2>
      <p>
        A "clade" is another name for a hierarchical cluster in a phylogenetic
        tree (see above).
      </p>
      <h2 className="reportSection" id="cousins">
        Cousins
      </h2>
      <p>
        We use this term to help contextualize the hierarchical cluster you're
        investigating. That is, if we "zoomed out" to the next-largest parent
        cluster, which other samples would be included?
      </p>
      <p>
        You can think of this like your family tree -- if we "zoomed out" from
        your immediate family to the next-largest group in your family tree,
        we'd be looking at the group defined by your grandparents (i.e., all of
        your cousins).
      </p>
      <h2 className="reportSection" id="clustering-metadata">
        Clustering based on metadata (aka "ancestral state reconstruction")
      </h2>
      <p>
        Phylogenetic trees already represent hierarchical clustering (see
        above). Sometimes, though, it can be helpful to use metadata to help us
        identify which hierarchical clusters in the tree are important to look
        at; this process of suggesting relevant clades based on when metadata
        (e.g., location) changes is also commonly referred to as "clustering."
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
        Weight Heuristic is a heuristic, rather than a model, meaning that it's
        somewhat less accurate, but is able to be run very quickly. This is why
        for some metadata fields, you may see Introduction Weight Heuristic
        enabled as a method, but not TreeTime (Introduction Weight Heuristic is
        so fast that we can run it on the spot within Galago).
      </p>
      <p>
        Once every node and sample in the tree has metadata assigned, the
        algorithm walks down the tree from the root to the samples and notes
        where metadata values change along the way (i.e., which hierarchical
        clusters represent a new value compared to their parents). For example,
        if the metadata you're using is "U.S. state," then each of these
        suggested "clusters" represents an introduction of the pathogen from one
        state to another.
      </p>
      <h2 className="reportSection" id="mutations">
        Mutations
      </h2>
      <p>
        Mutations are genetic differences between two samples, where one
        mutation = one base, or site, in the genome that differs.
      </p>
      <p>
        We estimate the number of mutations between nodes / samples in the tree
        based on patristic distances. Patristic distances are calculated by
        tracing the path between two samples / nodes and adding up the branch
        lengths that separate them in the tree. We use this method instead of
        raw SNP counts because patristic distances can be estimated directly
        from the tree, while SNP counts require a separate alignment file. These
        two metrics should be identical or very close to each other (remember
        that we expect uploaded trees to have branch lengths specified in units
        of mutations, not substitutions per site).
      </p>
      <p>
        <i>
          Note: there is a nuanced difference between "mutations" and
          "substitutions," but this is outside the scope of this guide. We use
          these terms interchangeably.
        </i>
      </p>
      <h2 className="reportSection" id="mutation-rate">
        Mutation rate (aka "evolutionary clock rate")
      </h2>
      <p>
        The pathogen-specific average number of mutations per unit of time. You
        can see this for many pathogens on Nextstrain by going to the "clock"
        view.
      </p>
      <h2 className="reportSection" id="mutations-per-transmission">
        Mutations per transmission
      </h2>
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
      <h2 className="reportSection" id="primary-case">
        Primary case (aka "most recent common ancestor")
      </h2>
      Internal nodes in the tree represent the inferred pathogen genotypes that
      must have existed upstream of the samples in the tree. This is powerful
      because [XYZ].
      <p></p>
      <h2 className="reportSection" id="secondary-tertiary-cases">
        Secondary and tertiary cases
      </h2>
      FOO BAR
      <h2 className="reportSection" id="onward-transmission">
        Onward transmission
      </h2>
      FOO BAR
      <p></p>
      <h2 className="reportSection" id="sampling-bias">
        Sampling bias
      </h2>
      <p>
        Phylogenetic trees represent the most likely hypothesis for how samples
        are related to one another genetically. Importantly, though, the tree
        does not account for unsampled or unsequenced cases; if your tree does
        not include sufficient background contextual data, it can be easy to be
        misled. See{" "}
        <a
          target="_blank"
          rel="noreferrer noopener"
          href="https://alliblk.github.io/genepi-book/sample-selection.html#contextual-data"
        >
          this section in the Applied Genomic Epidemiology Handbook
        </a>{" "}
        for more information.
      </p>
      <h2 className="reportSection" id="tmrca">
        Time to Most Recent Common Ancestor (TMRCA) for dating outbreaks:
      </h2>
      <p>
        Because pathogens evolve at a consistent rate, we can estimate the date
        of the primary case based on the collection date of its children and the
        number of mutations between the primary case and its children. See{" "}
        <a
          target="_blank"
          rel="noreferrer noopener"
          href="https://alliblk.github.io/genepi-book/fundamental-theory-in-genomic-epidemiology.html#mutation-rates-evolutionary-rates-and-the-molecular-clock"
        >
          this section in the Applied Genomic Epidemiology Handbook
        </a>{" "}
        to learn more.
      </p>
    </div>
  );
};

export default Methods;
