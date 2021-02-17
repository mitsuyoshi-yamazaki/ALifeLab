import React, { CSSProperties } from "react"
import { makeStyles, Card, CardContent, Link, Typography } from "@material-ui/core"

interface Props {
  title: string
  link: string
}

export class LinkCard extends React.Component<Props> {
  public render() {
    const cardStyle: CSSProperties = {
      width: "20rem",
      height: "10rem",
      marginTop: "1rem",
    }

    return (
      <Card variant="outlined" style={cardStyle}>
        <CardContent>
          <Link href={this.props.link}>
            <Typography variant="h5" component="h2">
              {this.props.title}
            </Typography>
          </Link>
          {this.props.children}
        </CardContent>
      </Card>
    )
  }
}
