// import React, { ReactNode } from "react";
// import { View, Text, Document, Page, PDFViewer } from "@react-pdf/renderer";

// type ComponentWrapperProps = {
//   style?: React.CSSProperties;
//   children?: ReactNode;
// };

// class ComponentWrapper<T> {
//   private component: React.ComponentType<T>;
//   private props: T;

//   constructor(component: React.ComponentType<T>, props: T) {
//     this.component = component;
//     this.props = props;
//   }

//   render() {
//     const Component = this.component;
//     return <Component {...this.props}>{this.props.children}</Component>;
//   }
// }

// // Ejemplo de uso
// const MyComponent = () => (
//   <PDFViewer width={500} height={300}>
//     <Document>
//       <Page size="A4">
//         {new ComponentWrapper(View, {
//           style: { flexDirection: "row" },
//         }).render()}
//         {new ComponentWrapper(Text, { style: { flex: 1 } }).render()}
//         {new ComponentWrapper(Text, { style: { flex: 1 } }).render()}
//       </Page>
//     </Document>
//   </PDFViewer>
// );

// export default MyComponent;
