import { CladeDescription } from "../d";
import { get_dist } from "../utils/treeMethods";

// THIS KIND OF CARD DESCRIBES A CLADE
type CladeProps = {
  data: CladeDescription;
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function ClusterUniqueness(props: CladeProps) {
  const { data } = props;

  const cousin_dates: Array<Date | null> = data.cousins
    .map((a) => a.node_attrs.num_date.value)
    .sort(function (a, b) {
      const date1 = new Date(a);
      const date2 = new Date(b);
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
      <h2>How unique are your samples, relative to the entire dataset? </h2>
      <p style={{ fontStyle: "italic" }}>
        How similar or distinct are your samples compared to the rest of the
        dataset?
      </p>
      <div className="results">
        <p>
          {/*TODO: show muts from parent? or shortest path from sample in cluster -> nearest cousin?*/}
          {`This clade is separated by other samples in the dataset by ${Math.min(
            ...cousin_distances
          )} or more mutation(s).`}
        </p>
        <p>
          {`The most closely related "cousins" to your clade of interest include ${
            data.cousins.length
          } sample(s) dated between ${cousin_dates[0]
            .toISOString()
            .substring(0, 10)} and ${cousin_dates[1]
            .toISOString()
            .substring(0, 10)} from these location(s): ${cousin_locations}.`}
        </p>
      </div>
    </div>
  );
}

export default ClusterUniqueness;
