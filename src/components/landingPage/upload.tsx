import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export const Upload = () => {
  // @ts-ignore -- one day I will learn how to `type` all my state variables, but that day is not today
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(state.locationOptions, state.divisionOptions);
  }, [state.divisionOptions, state.locationOptions]);

  return (
    <div>
      <h2>Demo with real-world outbreak data</h2>
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
      <p>
        <button
          type="button"
          name="loadDemo"
          onClick={() => dispatch({ type: "load demo" })}
        >
          Load Demo
        </button>{" "}
      </p>
      <h2>Analyze a potential outbreak</h2>
      <p>
        <i>
          Galago runs entirely in the browser. This means that your data never
          leaves your computer and is never accessible to anyone else.
        </i>
      </p>
      <p>
        <b>First, please upload a tree file.</b>
        <br />
        <i>This must be in Nextstrain's JSON file format.</i>
        <input
          type="file"
          name="file"
          onChange={(event: any) => {
            dispatch({
              type: "tree file uploaded",
              data: event.target.files[0],
            });
          }}
        />
      </p>
      <b>Next, please choose your location.</b>
      <br />
      <p>
        State:{" "}
        <select
          id="division-select"
          name="State"
          onChange={(e) =>
            dispatch({ type: "division set", data: e.target.value })
          }
          disabled={!state.divisionOptions}
          style={{ width: "15em" }}
        >
          {state.divisionOptions &&
            state.divisionOptions.map((division: string) => (
              <option value={division}>{division}</option>
            ))}
        </select>
      </p>
      <p>
        County:{" "}
        <select
          id="location-select"
          name="County"
          onChange={(event) => {
            dispatch({
              type: "location set",
              data: event.target.value,
            });
          }}
          disabled={!state.locationOptions}
          style={{ width: "15em" }}
        >
          {state.locationOptions &&
            state.locationOptions.map((county: string) => (
              <option value={county}>{county}</option>
            ))}
        </select>
      </p>
    </div>
  );
};

export default Upload;
