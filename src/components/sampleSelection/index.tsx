import MutsDateScatter from "./mutsDateScatter";
import ClusteringOptions from "./clusteringOptions";
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
      <SamplesOfInterest />
      {/* <ClusteringOptions /> */}
      {/* <MutsDateScatter/> */}
    </div>
  );
}
export default SampleSelection;
