import p5 from "p5"
import { Color } from "../../classes/color"
import { Atom } from "./atom"

export type Drawer = {
  draw(p: p5, atoms: Atom[]): void
}

export class SimpleDrawer implements Drawer {
  public constructor(
    public readonly color: Color,
  ) { }

  public draw(p: p5, atoms: Atom[]): void {
    p.strokeWeight(0.5)

    atoms.forEach(atom => this.drawAtom(p, atom))
  }

  private drawAtom(p: p5, atom: Atom): void {
    const p5Color = this.color.p5(p)

    switch (atom.shape.case) {
    case "circle":
      p.noStroke()
      p.fill(p5Color)
      p.circle(atom.position.x, atom.position.y, atom.shape.diameter)
      break

    case "rectangle":
      p.noStroke()
      p.fill(p5Color)
      p.rect(
        atom.position.x - (atom.shape.width / 2),
        atom.position.y - (atom.shape.height / 2),
        atom.shape.width,
        atom.shape.height,
      )
      // TODO: 角度
      break

    case "line":
      p.stroke(p5Color)
      // TODO: 
      break

    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = atom.shape
      break
    }
    }
  }
}