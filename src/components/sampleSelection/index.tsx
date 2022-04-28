import MutsDateScatter from "./mutsDateScatter";
import ClusteringOptions from "./clusteringMethodSelect";
import SamplesOfInterest from "./samplesOfInterest";

function SampleSelection() {
  // const state = useSelector((state) => state.global);
  // const dispatch = useDispatch();

  return (
    <div>
      <h2>Interactive sample selection</h2>
      <p>
        To instantly generate a report for any set of samples, select a cluster
        of samples based on the inferred primary case they descend from.
      </p>
      <MutsDateScatter />
      <div // actual table container
        style={{
          position: "relative",
          // borderBottom: "1px solid black",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "space-between",
          width: 960,
          marginTop: "3em",
          marginBottom: "3em",
        }}
      >
        <SamplesOfInterest />
        <ClusteringOptions />
      </div>
    </div>
  );
}
export default SampleSelection;
