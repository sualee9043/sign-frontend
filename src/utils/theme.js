import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0289b1",
    },
    secondary: {
      main: "#20b1db",
    },
    white: {
      main: "#ffffff",
    },
    setting: {
      light: "#b0b0b0",
      main: "#808080",
      dark: "#545454",
      contrastText: "#ffffff",
    },
    yellow: {
      main: "#e6c403",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontSize: 20,
    fontFamily: '"IBM Plex Sans KR", "sans-serif"',
  },
});

export default theme;
