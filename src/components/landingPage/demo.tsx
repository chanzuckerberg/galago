import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const darkPurple = "#4f2379";

export const Demo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="reportSection">
      <h2>Demo with real-world outbreak data</h2>
      <p style={{ width: 200, margin: "auto" }}>
        <Button
          variant="contained"
          name="loadDemo"
          disableElevation
          disableRipple
          onClick={() => {
            dispatch({ type: "load demo" });
            navigate("/galago/app");
          }}
          size="large"
          sx={{
            backgroundColor: darkPurple,
            "&:hover": {
              backgroundColor: "#f2f0f0",
              color: "#6D4F8A",
            },
          }}
        >
          Load Demo
        </Button>{" "}
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
