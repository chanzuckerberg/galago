import { Skeleton } from "@mui/material";

export const SkeletonReport = () => {
  //@ts-ignore

  return (
    <div>
      <h2>
        <Skeleton
          variant="text"
          width={260}
          animation={"wave"}
          sx={{
            animationDuration: "50ms",
            backgroundColor: "#f2f0f0",
          }}
        />
      </h2>
      <h5>
        <Skeleton
          variant="text"
          width={190}
          animation={"wave"}
          sx={{ animationDuration: "50ms", backgroundColor: "#f2f0f0" }}
        />
      </h5>
      <p>
        <Skeleton
          variant="rectangular"
          height={155}
          animation={"wave"}
          sx={{
            animationDuration: "50ms",
            backgroundColor: "#f2f0f0",
            marginBottom: 2,
          }}
        />
      </p>
      <div>
        <p>
          <Skeleton
            variant="rectangular"
            height={285}
            animation={"wave"}
            sx={{ animationDuration: "50ms", backgroundColor: "#f2f0f0" }}
          />
        </p>
        <p>
          <Skeleton
            variant="text"
            width={375}
            height={40}
            animation={"wave"}
            sx={{ animationDuration: "50ms", backgroundColor: "#f2f0f0" }}
          />
        </p>
      </div>
    </div>
  );
};

export default SkeletonReport;
