// import React from "react";
// import ReactPDF, { View } from "@react-pdf/renderer";
// import {
//   IBuilder,
//   IBlock,
//   RawJSON,
//   ComponentProps,
//   StyleMap,
// } from "./contracts";
// import { parseViewStyle } from "./utils";
// import UnstyledBlock from "./builders/unstyled";

// class ComponentBuilder implements IBuilder {
//   public blockComponent: IBlock | undefined = undefined;
//   public blocks: Array<React.FC<React.PropsWithChildren<ReactPDF.TextProps>>> =
//     [];
//   public componentType: string = "";
//   public styleMap: StyleMap;

//   constructor(styleMap: StyleMap) {
//     this.styleMap = styleMap;
//   }

//   public reset(): void {
//     this.blockComponent = undefined;
//   }

//   public buildBlocks(rawJson: RawJSON): void {
//     switch (rawJson.type) {
//       case "unstyled":
//         this.buildUnstyledBlocks(rawJson);
//         break;
//       // agregar aca los demas types
//       default:
//         break;
//     }
//   }

//   public buildUnstyledBlocks(rawJson: RawJSON): void {
//     this.blockComponent = new UnstyledBlock(rawJson, this.styleMap);
//     const blockStyle = parseViewStyle(rawJson.data, this.styleMap);
//     const block = (
//       <View key={rawJson.key} style={blockStyle}>
//         {this.blockComponent.getComponent()}
//       </View>
//     );
//   }

//   public buildHeaderBlocks(rawJson: RawJSON): void {}

//   public buildListBlocks(rawJson: RawJSON): void {}
// }
