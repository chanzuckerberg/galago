import { Tooltip } from "@mui/material";
import { tooltipProps } from "./formatters/sidenote";

export const Methods = () => {
  <div>
    <h1>Glossary & Methods</h1>
    <h4>Clade</h4>
    <p></p>
    <h4>Cluster</h4>
    <h4>Metadata-based clustering (aka "ancestral state reconstruction")</h4>
    <h4>Primary case (aka "most recent common ancestor")</h4>
    Internal nodes in the tree represent the inferred pathogen genotypes that
    must have existed upstream of the samples in the tree. This is powerful
    because [XYZ].
    <p></p>
    <h4>Secondary and tertiary cases</h4>
    Internal nodes in the tree represent the inferred pathogen genotypes that
    must have existed upstream of the samples in the tree. This is powerful
    because [XYZ].
    <p></p>
    <h4>Onward transmission</h4>
    Internal nodes in the tree represent the inferred pathogen genotypes that
    must have existed upstream of the samples in the tree. This is powerful
    because [XYZ].
    <p></p>
    <h4>Cousins</h4>
    <p></p>
    <h4>
      Dating outbreaks with the time of the most recent common ancestor (TMRCA):
    </h4>
    <p></p>
    <h4>Mutations</h4>
    <p>
      We estimate the number of mutations between nodes / samples in the tree
      based on patristic distances. Patristic distances are calculated by
      tracing the path between two samples / nodes and adding up the branch
      lengths that separate them in the tree. We use this method instead of raw
      SNP counts because patristic distances can be estimated directly from the
      tree, while SNP counts require a separate alignment file. These two
      metrics should be identical or very close to each other (remember that we
      expect uploaded trees to have branch lengths specified in units of
      mutations, not substitutions per site).
    </p>
    <p>
      <i>
        Note: there is a nuanced difference between "mutations" and
        "substitutions," but this is outside the scope of this guide. We use
        these terms interchangeably.
      </i>
    </p>
    <h4>Mutation rate (aka "evolutionary clock rate")</h4>
    <p>
      The pathogen-specific average number of mutations per unit of time. You
      can see this for many pathogens on Nextstrain by going to the "clock"
      view.
    </p>
    <h4>Mutations per transmission</h4>
    <p>
      {`Throughout the application, we convert between the number of mutations and the number of transmissions using a threshold. We choose this threshold such that the P(N or more mutations between cases | cases are directly linked) is < 10%.`}
      We estimate this threshold using the poisson cumulative density function,
      where lambda is the average number of mutations per serial interval.
      Importantly, this value can be quite variable based on the epidemiological
      setting, which is why we always provide a range.
    </p>
    <h4>Sampling bias</h4>
    <p></p>
  </div>;
};

export default Methods;
