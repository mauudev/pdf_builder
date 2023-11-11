import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../heading-one/heading-one.styles";

const UnorderedList = ({ children, depth }) => {
  return <View style={styles.list}>{children}</View>;
};

const UnorderedListItem = ({ children }) => {
  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>
        • &nbsp;<Text>{children}</Text>
      </Text>
    </View>
  );
};

export { UnorderedList, UnorderedListItem };
