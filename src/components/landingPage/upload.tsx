import { useSelector, useDispatch } from "react-redux";
import { ingestNextstrain } from "../../utils/nextstrainAdapter";
import { Button, Dialog, FormHelperText, Tooltip } from "@mui/material";
import UploadModal from "./uploadModal";
import Theme from "../../theme";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { tooltipProps } from "../formatters/sidenote";

type UploadProps = {
  sectionWidth: number;
};
export const Upload = (props: UploadProps) => {
  const { sectionWidth } = props;
  // @ts-ignore -- one day I will learn how to `type` all my state variables, but that day is not today
  const state = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const loadTreeJson = (file: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file, "application/JSON");
    fileReader.onload = (event) => {
      if (event?.target?.result && typeof event.target.result === "string") {
        dispatch({
          type: "tree file uploaded",
          data: ingestNextstrain(JSON.parse(event.target.result)),
        });
      }
    };
  };

  return (
    <div
      style={{
        //@ts-ignore
        backgroundColor: Theme.palette.secondary.lighter,
        width: sectionWidth,
        maxWidth: sectionWidth,
        borderRadius: 5,
        padding: 20,
        marginTop: 30,
        paddingTop: 20,
        marginBottom: 20,
        paddingBottom: 20,
      }}
    >
      <h2>Analyze your data</h2>
      <p>
        Use your own phylogenetic tree of pathogen genomes for analysis in
        Galago. Galago runs entirely in the browser. This means that your data
        never leaves your computer and is never accessible to anyone else.
      </p>
      <p style={{ marginTop: 40 }}>
        <Button
          variant="outlined"
          component="label"
          disableElevation
          disableRipple
          onChange={(event: any) => {
            loadTreeJson(event.target.files[0]);
          }}
        >
          Select tree JSON <input hidden type="file" />
        </Button>
        <FormHelperText>
          This must be in Nextstrain's JSON format{" "}
          <Tooltip
            componentsProps={tooltipProps}
            title={
              <>
                If you need help generating a phylogenetic tree, head over to{" "}
                <a href="https://czgenepi.org" style={{ color: "white" }}>
                  CZ GEN EPI
                </a>
              </>
            }
          >
            <InfoOutlined
              color="primary"
              style={{ fontSize: 16, position: "relative", top: 4 }}
            />
          </Tooltip>
        </FormHelperText>
      </p>
      <p>
        <Button
          variant="contained"
          disabled={!state.tree}
          disableElevation
          disableRipple
          onClick={() => {
            dispatch({ type: "upload modal toggled" });
          }}
          size="large"
        >
          Get started
        </Button>
      </p>
      <Dialog
        open={state.uploadModalOpen}
        onClose={() => dispatch({ type: "upload modal toggled" })}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <UploadModal />
      </Dialog>
    </div>
  );
};

export default Upload;
