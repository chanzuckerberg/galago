import { CladeDescription, Node } from "../d";
import { get_dist } from "../utils/treeMethods";

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
    .sort(function (a, b) {
      const date1 = new Date(a);
      const date2 = new Date(b);
      //@ts-ignore -- for whatever reason typescript doesn't like arithmetic with date objects, but this totally works
      return date1 - date2;
    });

  return (
    <div>
      <h2>
        How similar or unique is this clade, relative to background community
        transmission?{" "}
      </h2>
      <p style={{ fontStyle: "italic" }}>
        Comparing the primary case for this clade with its closest relatives in
        the tree can help us identify whether we have selected the right scope
        for our investigation.
      </p>
      <div className="results">
        <p>
          The primary case upstream of all the samples in this clade is
          separated from other samples in the dataset by{" "}
          <span className="dataPoint">{Math.min(...cousin_distances)}</span> or
          more mutation(s), or at least{" "}
          <span className="dataPoint">
            {Math.min(...cousin_distances) *
              clade_description.muts_per_trans_minmax[0]}{" "}
            -{" "}
            {Math.min(...cousin_distances) *
              clade_description.muts_per_trans_minmax[1]}
          </span>{" "}
          transmission events.
        </p>
      </div>
      <div>
        <p>
          If there are many samples that are closely related genetically, have
          overlapping timeframes, and are geographically co-located, you may
          want to consider expanding the scope of your investigation.{" "}
        </p>
        <div className="results">
          <p>
            In this dataset, the samples most closely related to your clade of
            interest include{" "}
            <span className="dataPoint">{local_cousins.length}</span> other
            samples from {clade_description.home_geo.location}
            {local_cousins.length > 0 ? (
              <>
                , dated between{" "}
                <span className="dataPoint">
                  {local_cousin_dates[0].toISOString().substring(0, 10)}
                </span>{" "}
                and{" "}
                <span className="dataPoint">
                  {local_cousin_dates
                    .slice(-1)[0]
                    .toISOString()
                    .substring(0, 10)}
                </span>
                :{" "}
                <span className="dataPoint">
                  {local_cousins.map((s) => (
                    <span className="dataPoint">{s.name}</span>
                  ))}
                </span>
                .
              </>
            ) : (
              "."
            )}
          </p>

          {clade_description.cousins.length - local_cousins.length > 1 && (
            <p>
              There are also{" "}
              <span className="dataPoint">
                {clade_description.cousins.length - local_cousins.length}
              </span>{" "}
              closely related samples from these locations:{" "}
              {cousin_locations.map((l) => (
                <span className="dataPoint">{l}</span>
              ))}
            </p>
          )}

          {/* <p>
            {clade_description.cousins.length - local_cousins.length < 1
              ? ""
              : cousin_locations.map((l) => (
                  <span className="dataPoint">{l}</span>
                ))}
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default CladeUniqueness;
