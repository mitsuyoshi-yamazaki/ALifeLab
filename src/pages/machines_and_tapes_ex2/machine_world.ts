import { WorldObject } from "src/alife-game-jam/object"
import { VanillaWorld } from "../../alife-game-jam/world"
import { Vector } from "../../classes/physics"
import { Machine } from "./machine"

export class MachineWorld extends VanillaWorld {
  private _machines: Machine[] = []

  public get objects(): WorldObject[] {
    return this._machines
  }

  public addMachine(machines: Machine[]): void {
    this._machines.push(...machines)
  }

  public next(): void {
    const newMachines: Machine[] = []
    const used: Machine[] = []
    const _moved: Machine[] = []  // 接触するとしばらくconnectし続けるため // FixMe: そのようなことが起きないようにする: 分解する際に離れる力が加わるなど

    const sortedByX: Machine[] = [...this._machines].sort((lhs, rhs) => {
      return lhs.position.x - rhs.position.x
    })

    for (let i = 0; i < (sortedByX.length - 1); i += 1) {
      const machine = sortedByX[i]
      if (used.indexOf(machine) >= 0) {
        continue
      }

      this.updatePosition(machine)

      for (let k = i + 1; k < sortedByX.length; k += 1) {
        const compareTo = sortedByX[k]

        const distance = machine.position.dist(compareTo.position)
        const minDistance = (machine.size + compareTo.size) / 2
        const isColliding = distance < minDistance
        if (isColliding === false) {
          continue
        }

        if (machine.canConnect(compareTo.tape) === false) {
          continue
        }
        used.push(compareTo)
        _moved.push(machine)
        const offspring = machine.connect(compareTo.tape)
        if (offspring) {
          _moved.push(offspring)
          newMachines.push(offspring)
        }
        continue
      }
    }

    this._machines = this._machines.filter(m => {
      if (used.indexOf(m) >= 0) {
        return false
      } else if (m.isAlive) {
        return true
      } else {
        const decomposed = m.decompose()
        newMachines.push(decomposed[0])
        _moved.push(decomposed[0])
        if (decomposed[1] != undefined) {
          newMachines.push(decomposed[1])
          _moved.push(decomposed[1])
        }

        return false
      }
    })
    this._machines.push(...newMachines)

    _moved.forEach(m => {
      const distance = Vector.random(1, -1)
        .sized(20)
      m.position = m.position
        .add(distance)
        .truncate(this.size)
    })
  }

  private updatePosition(machine: Machine) {
    const distance = 5
    machine.position = machine.position
      .add(Vector.random(distance, -distance))
      .truncate(this.size)
  }
}
