import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";

const Placeholder = () => {
  return (
    <>
      <Skeleton
        variant="text"
        width={400}
        height={40}
        animation={false}
        sx={{ animationDuration: "3s" }}
      />
      {/* <Skeleton
        variant="text"
        width={400}
        height={40}
        animation="none"
        sx={{ animationDuration: "3s" }}
      /> */}
    </>
  );
};

export const SkeletonReport = () => {
  //@ts-ignore
  const state = useSelector((state) => state.global);

  return (
    <div>
      <h2>Genomic situation status</h2>
      <Placeholder />
      <h2>How closely related are your selected samples to each other?</h2>
      <Placeholder />

      <h2>
        How similar or unique is this clade, relative to background community
        transmission?
      </h2>
      <Placeholder />

      {state.haveInternalNodeDates ? (
        <h2>What was the date and genotype of the primary infection?</h2>
      ) : (
        <h2>What was the genotype of the primary infection?</h2>
      )}
      <Placeholder />

      <h2>
        Has transmission between geographic areas contributed to this clade?
      </h2>
      <Placeholder />

      <h2>How much onward transmission have we observed?</h2>
      <Placeholder />

      <h2>How representative is your dataset?</h2>
      <Placeholder />

      <h2> What assumptions influence this report?</h2>
      <Placeholder />
    </div>
  );
};

export default SkeletonReport;
