import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"
import { ThemeProvider } from "@material-ui/core"
import { defaultTheme } from "../../react-components/common/default_theme"
import { Display } from "../../react-components/art/display"
import { Footer } from "../../react-components/common/footer"

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
        description="自動生成される幾何学図形"
        backgroundColor={backgroundListColor2}
        link={path("/pages/drawer_gallery.html")}
      />
      <Footer homePath={path("/")} />
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
