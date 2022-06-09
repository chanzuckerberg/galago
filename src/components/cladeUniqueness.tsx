import { CladeDescription, Node } from "../d";
import { get_dist } from "../utils/treeMethods";
import { FormatStringArray } from "./formatters/stringArray";
import { FormatDate } from "./formatters/date";
import { FormatDataPoint } from "./formatters/dataPoint";

type CladeProps = {
  clade_description: CladeDescription;
};

function CladeUniqueness(props: CladeProps) {
  const { clade_description } = props;
  const tmrca = clade_description.mrca.node_attrs.num_date.value;

  const cousin_locations: Array<string> = [
    ...new Set(
      clade_description.cousins.map((a) => a.node_attrs.location.value)
    ),
  ].sort();

  const cousin_distances: number[] = clade_description.cousins.map((c: Node) =>
    get_dist([c, clade_description.mrca])
  );

  const local_cousins: Node[] = clade_description.cousins.filter(
    (c) => c.node_attrs.location.value === clade_description.home_geo.location
  );

  const local_cousin_dates: Array<Date> = local_cousins
    .map((a) => a.node_attrs.num_date.value)
    .sort((a, b) => a.getTime() - b.getTime());

  return (
    <div>
      <h2>
        How similar or unique is this clade, relative to background community
        transmission?
      </h2>
      <p style={{ fontStyle: "italic" }}>
        Comparing the primary case for this clade with its closest relatives in
        the tree can help us identify whether we have selected the right scope
        for our investigation.
      </p>
      <p className="results">
        The primary case upstream of all the samples in this clade is separated
        from other samples in the dataset by{" "}
        <FormatDataPoint value={Math.min(...cousin_distances)} /> or more
        mutation(s), or at least{" "}
        <FormatDataPoint
          value={`
            ${
              Math.min(...cousin_distances) *
              clade_description.muts_per_trans_minmax[0]
            } 
            - ${
              Math.min(...cousin_distances) *
              clade_description.muts_per_trans_minmax[1]
            }`}
        />{" "}
        transmissions.
      </p>
      <p>
        If there are many inferred transmissions separating your clade of
        interest from its nearest relatives, this is a good indication that
        there are missing intermediate cases that have not been sampled and/or
        included in this dataset, and you may be looking at a partial picture.
      </p>
      <p>
        Conversely, if there are many samples that are closely related
        genetically, have overlapping timeframes, and are geographically
        co-located, you may want to consider expanding the scope of your
        investigation.{" "}
      </p>
      <p className="results">
        In this dataset, the samples most closely related to your clade of
        interest include <FormatDataPoint value={local_cousins.length} /> other
        samples from{" "}
        <FormatDataPoint value={clade_description.home_geo.location} />
        {local_cousins.length > 0 ? (
          <>
            , dated between <FormatDate date={local_cousin_dates[0]} /> and{" "}
            <FormatDate date={local_cousin_dates.slice(-1)[0]} />
            :
            <FormatStringArray values={local_cousins.map((s) => s.name)} />
          </>
        ) : (
          <>.</>
        )}
      </p>
      {clade_description.cousins.length - local_cousins.length > 1 && (
        <p>
          There are also{" "}
          <FormatDataPoint
            value={clade_description.cousins.length - local_cousins.length}
          />{" "}
          closely related samples from these locations:
          <FormatStringArray values={cousin_locations} />
        </p>
      )}
    </div>
  );
}

export default CladeUniqueness;
