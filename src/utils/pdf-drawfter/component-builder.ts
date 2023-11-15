import { IBuilder, IBlock, ComponentProps } from "./contracts";
import UnstyledBlock from "./builders/unstyled";

class ComponentBuilder implements IBuilder {
  public rawJson: object;
  public blockComponent: IBlock | undefined = undefined;
  public blocks: Array<React.ComponentType<ComponentProps>> = [];
  public componentType: string;

  constructor(rawJson: object, componentType: string) {
    this.rawJson = rawJson;
    this.componentType = componentType;
  }

  public reset(): void {
    this.blockComponent = undefined;
  }

  public buildBlocks(): void {
    switch (this.componentType) {
      case "unstyled":
        this.buildUnstyledBlocks();
        break;
      case "header":
        this.buildHeaderBlocks();
        break;
      case "list":
        this.buildListBlocks();
        break;
      default:
        break;
    }
  }

  public buildUnstyledBlocks(): void {
    this.blockComponent = new UnstyledBlock();
  }

  public buildHeaderBlocks(headerType: string): void {}

  public buildListBlocks(listType: string): void {}
}
