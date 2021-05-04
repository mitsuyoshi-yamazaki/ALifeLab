import { createMuiTheme } from "@material-ui/core"

const fontFamily = [
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(",")

const fontFamilyOverride = { fontFamily }

export const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#8a8a8a",
      main: "#575757",
      dark: "#454545",
    }
  },
  typography: {
    fontFamily,
    h1: fontFamilyOverride,
    h2: fontFamilyOverride,
    h3: fontFamilyOverride,
    h4: fontFamilyOverride,
    h5: fontFamilyOverride,
    h6: fontFamilyOverride,
    subtitle1: fontFamilyOverride,
    subtitle2: fontFamilyOverride,
    body1: fontFamilyOverride,
    body2: fontFamilyOverride,
    button: fontFamilyOverride,
    caption: fontFamilyOverride,
    overline: fontFamilyOverride,
  }
})