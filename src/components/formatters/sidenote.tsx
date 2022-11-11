import { Tooltip } from "@mui/material";
import Theme from "../../theme";

export const tooltipProps = {
  tooltip: {
    sx: {
      fontSize: "16px",
      // fontWeight: "bold",
      // bgcolor: "#616161",
      // a: { color: "white", fontWeight: "bold" },
    },
  },
};

type SidenoteProps = {
  contents: string | any;
  target: string;
};

const Sidenote = (props: SidenoteProps) => {
  const { contents, target } = props;
  return (
    <Tooltip title={contents} componentsProps={tooltipProps} arrow>
      <span
        style={{
          // fontWeight: "bold",
          borderBottom: `3px dotted ${Theme.palette.primary.main}`,
        }}
      >
        {target}
      </span>
    </Tooltip>
  );
};
export default Sidenote;
