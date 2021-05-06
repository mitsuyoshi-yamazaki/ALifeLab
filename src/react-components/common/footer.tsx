import React, { ReactNode, CSSProperties } from "react"
import { Link, Typography } from "@material-ui/core"
import { webConstants } from "../../react-components/common/web_constants"
import { defaultTheme } from "../../react-components/common/default_theme"

interface Props {
  homePath: string
}

export class Footer extends React.Component<Props> {
  public render(): ReactNode {
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
          {createLink(this.props.homePath, "Home")}
          {createSeparator()}
          {createExternalLink(webConstants.twitterProfileUrl, "Twitter")}
          {createSeparator()}
          {createExternalLink(webConstants.instagramProfileUrl, "Instagram")}
        </div>
      </div>
    )
  }
}
