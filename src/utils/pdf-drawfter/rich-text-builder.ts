// import React from "react";
// import { Paragraph } from "./rich-text/paragraph/paragraph";
// /**
//  * Styles to apply:
//  * - page margins: top, right, bottom, left
//  * - line height
//  * - page size
//  * - Agregar el totalLength a cada entry del raw json
//  *
//  * Builders:
//  * - Unstyled
//  * - Header
//  * - List
//  * - PageBuilder (aka director ?)
//  */




// interface IHeaderBlockBuilder {
//   buildHeaderOneBlock(): void;
//   buildHeaderTwoBlock(): void;
//   buildHeaderThreeBlock(): void;
//   buildHeaderFourBlock(): void;
//   buildHeaderFiveBlock(): void;
//   buildHeaderSixBlock(): void;
// }

// interface IListBlockBuilder {
//   buildUnorderedListBlock(): void;
//   buildOrderedListBlock(): void;
// }

// interface IPageBuilder {
//   buildPage(): void;
// }





// class UnstyledBlock {
//   private paragraph: Paragraph;
//   constructor(styles, children) {
//     this.paragraph = <Paragraph styles={styles}>{children}</Paragraph>;
//   }

//   render() {
//     return this.paragraph;
//   }
// }

// /**
//  * The Director is only responsible for executing the building steps in a
//  * particular sequence. It is helpful when producing products according to a
//  * specific order or configuration. Strictly speaking, the Director class is
//  * optional, since the client can control builders directly.
//  */
// class Director {
//   private builder: Builder;

//   constructor() {
//     this.builder = new ConcreteBuilder1(); // Inicializar builder con un valor por defecto
//   }
//   /**
//    * The Director works with any builder instance that the client code passes
//    * to it. This way, the client code may alter the final type of the newly
//    * assembled product.
//    */
//   public setBuilder(builder: Builder): void {
//     this.builder = builder;
//   }

//   /**
//    * The Director can construct several product variations using the same
//    * building steps.
//    */
//   public buildMinimalViableProduct(): void {
//     this.builder.producePartA();
//   }

//   public buildFullFeaturedProduct(): void {
//     this.builder.producePartA();
//     this.builder.producePartB();
//     this.builder.producePartC();
//   }
// }

// /**
//  * The client code creates a builder object, passes it to the director, and then
//  * initiates the construction process. The end result is retrieved from the
//  * builder object.
//  */
// function clientCode(director: Director) {
//   const builder = new ConcreteBuilder1();
//   director.setBuilder(builder);

//   console.log("Standard basic product:");
//   director.buildMinimalViableProduct();
//   builder.getProduct()?.listParts();

//   console.log("Standard full-featured product:");
//   director.buildFullFeaturedProduct();
//   builder.getProduct()?.listParts();

//   // Remember, the Builder pattern can be used without a Director class.
//   console.log("Custom product:");
//   builder.producePartA();
//   builder.producePartC();
//   builder.getProduct()?.listParts();
// }

// const director = new Director();
// clientCode(director);
