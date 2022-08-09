import { Tooltip, tooltipClasses } from "@mui/material";

export const tooltipProps = {
  tooltip: {
    sx: {
      fontSize: "16px",
      // fontWeight: "bold",
      bgcolor: "#616161",
      a: { color: "white", fontWeight: "bold" },
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
          borderBottom: "3px dotted #4f2379",
        }}
      >
        {target}
      </span>
    </Tooltip>
  );
};
export default Sidenote;
