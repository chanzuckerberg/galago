import { CladeDescription, Node } from "../d";
import { get_dist } from "../utils/treeMethods";

type CladeProps = {
  data: CladeDescription;
};

function CladeUniqueness(props: CladeProps) {
  const { data } = props;
  const tmrca = data.mrca.node_attrs.num_date.value;
  console.log(
    "MRCA DATE / TYPE / NAN IN CLADE UNIQUENESS",
    tmrca,
    typeof tmrca,
    isNaN(tmrca)
  );

  const cousin_dates: Array<Date> = data.cousins
    .map((a) => a.node_attrs.num_date.value)
    .sort(function (a, b) {
      const date1 = new Date(a);
      const date2 = new Date(b);
      //@ts-ignore -- for whatever reason typescript doesn't like arithmetic with date objects, but this totally works
      return date1 - date2;
    });
  const cousin_locations: Array<string> = [
    ...new Set(data.cousins.map((a) => a.node_attrs.location.value)),
  ];

  const cousin_distances: number[] = data.cousins.map((c: Node) =>
    get_dist([c, data.mrca])
  );

  return (
    <div>
      <h2>How unique is this clade, relative to the entire dataset? </h2>
      <div className="results">
        <p>
          {/*TODO: show muts from parent? or shortest path from sample in cluster -> nearest cousin?*/}
          {`This clade is separated by other samples in the dataset by `}
          <span className="dataPoint">
            {Math.min(...cousin_distances)}
          </span>{" "}
          {`or more mutation(s).`}
        </p>
        <p>
          {`The most closely related "cousins" to your clade of interest include `}
          <span className="dataPoint">{data.cousins.length}</span> sample(s)
          dated between{" "}
          <span className="dataPoint">
            {cousin_dates[0].toISOString().substring(0, 10)} and{" "}
            {cousin_dates[1].toISOString().substring(0, 10)}
          </span>{" "}
          {`from these location(s): `}{" "}
          {cousin_locations.map((l) => (
            <span className="dataPoint">{l}</span>
          ))}
          .
        </p>
      </div>
    </div>
  );
}

export default CladeUniqueness;
