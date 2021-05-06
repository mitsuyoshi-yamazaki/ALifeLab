import p5 from "p5"
import { Vector } from "../../classes/physics"
import { Model } from "../hex_cellular_automata/model"
import { BinaryRule } from "../hex_cellular_automata/rule"

export interface AutoSearchConfig {
  fieldSize: Vector
  cellSize: number
}


// TODO: 探索開始/終了操作
export class AutoSearch {
  public get model(): Model {
    return this._model
  }
  public get automatonSize(): Vector {
    return this._automatonSize
  }

  private _model: Model
  private _automatonSize: Vector

  public constructor(public readonly config: AutoSearchConfig) {
    const fieldSize = config.fieldSize
    const cellSize = config.cellSize
    this._automatonSize = new Vector(Math.floor(fieldSize.x / cellSize), Math.floor(fieldSize.y / ((cellSize * Math.sqrt(3)) / 2)))
    this._model = this.nextModel()
  }

  public next(): void {
    this.model.next()
  }

  public draw(p: p5): void {
    this.model.draw(p, this.config.cellSize)
  }

  private nextModel(): Model {
    return new Model(
      this.automatonSize,
      this.nextRule(),
      "locality", // TODO:
    )
  }

  private nextRule(): BinaryRule {
    return BinaryRule.random()  // TODO:
  }
}