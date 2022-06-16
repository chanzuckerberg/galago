import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Demo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div>
      <h2>Demo with real-world outbreak data</h2>
      <p>
        <button
          type="button"
          name="loadDemo"
          onClick={() => {
            dispatch({ type: "load demo" });
            navigate("/galago/app");
          }}
        >
          Load Demo
        </button>{" "}
      </p>
      <p>
        Genomic epidemiology helped public health officials understand a
        real-world outbreak of SARS-CoV-2 at a farm in Humboldt County. This
        demo report is automatically generated based on the same phylogenetic
        tree that was used in this investigation.
        <br />
        <a href="https://www.medrxiv.org/content/10.1101/2021.09.21.21258385v1">
          You can read more about this outbreak here.
        </a>
      </p>
    </div>
  );
};

export default Demo;
