import PDF from "./features/pdf-builder/pdf";

const report = {
  title: "My app here",
  entries: [
    {
      item: {
        assetPreviewLarge: "/public/favicon.ico",
      },
      pageBreak: false,
      notes:
        "Este es el texto enriquecido que se mostrará en el componente RichText",
    },
  ],
};

function App() {
  return <PDF report={report} />;
}

export default App;
