import { ComputerApi } from "../../module/api"
import { AnyModuleDefinition, ModuleId } from "../../module/module"
import { SourceCode } from "../../module/source_code"

export class ExampleCode implements SourceCode {
  public constructor(
  ) {
  }

  public run(api: ComputerApi): void {
    const codeBase: () => SourceCode = () => (new ExampleCode())

    api.status.getInternalModules("channel").forEach(channel => {
      api.action.uptake(channel.id)
    })

    if (api.status.getEnergyAmount() >= 1000) {
      const assembler = api.status.getInternalModules("assembler")[0]

      // Mutating moduleDefinitions alters child's ability
      // Mutating codeBase alteres child's behavior
      const moduleDefinitions: AnyModuleDefinition[] = [
        { case: "hull", size: 5 },
        { case: "computer", codeBase },
        { case: "assembler" },
        { case: "channel", materialType: "energy" },
        { case: "mover" },
      ]

      moduleDefinitions.forEach(moduleDefinition => {
        api.action.assemble(assembler.id, this.assembleTarget(), moduleDefinition)
      })
    }
  }

  private assembleTarget(): ModuleId<"hull"> {
    throw "dummy"
  }

  private nextModuleDefinitionToAssemble(): AnyModuleDefinition {
    throw "dummy"
  }
}