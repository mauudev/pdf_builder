import React, { useMemo } from "react";
import {
  Document as PDFDocument,
  StyleSheet,
  Page,
  Font,
} from "@react-pdf/renderer";
import Entry from "./entry";
import { v4 as uuidv4 } from "uuid";

Font.register({
  family: "Public Sans",
  fonts: [
    { src: "https://cdn.companycam.com/fonts/PublicSans-Regular.ttf" },
    {
      src: "https://cdn.companycam.com/fonts/PublicSans-SemiBold.ttf",
      fontWeight: 700,
    },
  ],
});

Font.registerEmojiSource({
  format: "png",
  url: "https://twemoji.maxcdn.com/2/72x72/",
});

const Document = ({ report, imageSize }) => {
  const {
    entries,
    settings,
    photoCount,
    company,
    title,
    subtitle,
    createdAt,
    featuredEntry,
  } = report;

  return (
    <PDFDocument>
      <Page size="LETTER">
        {entries.map((entry) => {
          return <Entry key={uuidv4()} entry={entry} settings={settings} />;
        })}
      </Page>
    </PDFDocument>
  );
};

export default Document;
