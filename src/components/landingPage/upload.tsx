import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { get_division_input_options } from "../../utils/geoInputOptions";
import { ingestNextstrain } from "../../utils/nextstrainAdapter";
import { Node } from "../../d";
import { Box, Button, Dialog, FormHelperText } from "@mui/material";
import UploadModal from "./uploadModal";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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
    console.log("filereader looks like", fileReader);
    fileReader.onload = (event) => {
      console.log("loaded file!");

      if (event?.target?.result && typeof event.target.result === "string") {
        const { tree, haveInternalNodeDates } = ingestNextstrain(
          JSON.parse(event.target.result)
        );
        dispatch({
          type: "tree file uploaded",
          data: tree,
        });
        dispatch({
          type: "determined if internal node dates",
          data: haveInternalNodeDates,
        });
      }
    };
  };

  return (
    <div
      style={{
        backgroundColor: "#f2f0f0",
        width: sectionWidth,
        maxWidth: sectionWidth,
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
      <p>
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
      </p>
      <p>
        <Button
          variant="contained"
          // disabled={!state.tree}
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
