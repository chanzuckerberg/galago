import { createTheme } from "@mui/material/styles";

const darkPurple = "#4f2379";
const mediumPurple = "#9475b3";
const lightPurple = "#d9cde3";

const lightestGray = "rgba(220,220,220,1)";
const mediumGray = "rgba(180,180,180,1)";
const darkestGray = "rgba(80,80,80,1)";

export const Theme = createTheme({
  palette: {
    primary: {
      //@ts-ignore
      lighter: lightPurple,
      light: mediumPurple,
      main: darkPurple,
      // dark: "#451480",
    },
    secondary: {
      light: lightestGray,
      main: mediumGray,
      dark: darkestGray,
    },
  },
});

export default Theme;
