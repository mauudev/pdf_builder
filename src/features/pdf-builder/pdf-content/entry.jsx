import React from "react";
import { StyleSheet, View, Image, Text, Link } from "@react-pdf/renderer";
import RichText from "./rich-text";

const styles = StyleSheet.create({
  containerStyles: {
    margin: 10,
    padding: 10,
    border: "1 solid #000",
  },
  imageContainerStyles: {
    border: "1 solid #ccc",
    padding: 5,
    margin: 10,
  },
  imageStyles: {
    width: 200,
    height: 150,
  },
  contentStyles: {
    marginTop: 10,
  },
});

const Entry = ({ entry }) => {
  const { item, pageBreak } = entry;
  const { assetPreviewLarge } = item;

  return (
    <View style={styles.containerStyles} wrap={false} break={pageBreak}>
      <View style={styles.contentStyles}>
        <RichText note={entry.notes} />
      </View>
    </View>
  );
};

export default Entry;
