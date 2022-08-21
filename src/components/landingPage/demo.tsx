import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Theme } from "../../theme";

type DemoProps = {
  sectionWidth: number;
};

export const Demo = (props: DemoProps) => {
  const { sectionWidth } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div
      style={{
        //@ts-ignore
        backgroundColor: Theme.palette.secondary.lighter,
        borderRadius: 5,
        width: sectionWidth,
        maxWidth: sectionWidth,
        padding: 20,
        marginTop: 30,
        paddingTop: 20,
        marginBottom: 20,
        paddingBottom: 20,
      }}
    >
      <h2>Demo with real-world outbreak data</h2>
      <p>
        Genomic epidemiology helped public health officials understand a
        real-world outbreak of SARS-CoV-2 at a farm in Humboldt County. This
        demo report is automatically generated based on the same phylogenetic
        tree that was used in this investigation. <br />
        <a href="https://www.medrxiv.org/content/10.1101/2021.09.21.21258385v1">
          Read more about this outbreak
        </a>
        .
      </p>
      <p style={{ marginTop: 40, height: 37 }} />
      <p style={{ width: 200 }}>
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
        >
          Load Demo
        </Button>{" "}
      </p>
    </div>
  );
};

export default Demo;
