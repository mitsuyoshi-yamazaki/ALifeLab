import React, { CSSProperties, ReactNode } from "react"
import ReactDOM from "react-dom"
import { Link, ThemeProvider, Typography } from "@material-ui/core"
import { defaultTheme } from "../../react-components/default_theme"
import { webConstants } from "../../react-components/web_constants"
import { Display } from "../../react-components/display"
import createTypography from "@material-ui/core/styles/createTypography"

const path = (relativePath: string): string => `..${relativePath}`
const Title = () => {
  const style: CSSProperties = {
    display: "table", // horizontal center
    margin: "auto",
    marginTop: "90px",
    marginBottom: "90px",
  }

  return (
    <div>
      <img src={path("/resources/title.svg")} style={style} /> {/* Dunno how to show Futura as text */}
    </div>
  )
}

const Footer = () => {
  const footerStyle: CSSProperties = {
    paddingTop: "5rem",
    paddingBottom: "5rem",
    backgroundColor: defaultTheme.palette.grey["400"],
  }
  const linkStyle: CSSProperties = {
    display: "table",
    margin: "auto",
  }
  const createSeparator = (): ReactNode => <Typography display="inline">  /  </Typography>

  // FixMe: variant="body1"はTheme適用のためだが正しい操作ではない気がする
  const createLink = (link: string, title: string): ReactNode => <Link variant="body1" href={link}>{title}</Link>
  const createExternalLink = (link: string, title: string): ReactNode =>
    <Link variant="body1" target="_blank" rel="noopener" href={link}>{title}</Link>

  return (
    <div style={footerStyle}>
      <div style={linkStyle}>
        {createLink(path("/"), "Home")}
        {createSeparator()}
        {createExternalLink(webConstants.twitterProfileUrl, "Twitter")}
        {createSeparator()}
        {createExternalLink(webConstants.instagramProfileUrl, "Instagram")}
      </div>
    </div>
  )
}

const App = () => {
  const backgroundListColor1 = defaultTheme.customized.background.list1
  const backgroundListColor2 = defaultTheme.customized.background.list2

  return (
    <ThemeProvider theme={defaultTheme}>
      <Title />
      <Display
        imagePath={path("/resources/blindpainter.jpg")}
        title="BlindPainter"
        subtitle="2019, ALife, Processing"
        description="人工生命の栄枯盛衰"
        backgroundColor={backgroundListColor1}
        link="https://mitsuyoshi-yamazaki.github.io/ALifeGameJam2019/pages/blind_painter_classic.html"
      />
      <Display
        imagePath={path("/resources/lsystem_artboard.jpg")}
        title="線と角度"
        subtitle="2021, L-System, Processing"
        description="自動生成された幾何学図形"
        backgroundColor={backgroundListColor2}
        link={path("/pages/drawer.html?system.run=0&system.auto_download=0")}
      />
      <Footer />
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
