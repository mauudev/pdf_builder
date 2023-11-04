import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../heading-one/heading-one.styles";

export const OrderedList = ({ children, depth }) => {
  return <View style={styles.list}>{children}</View>;
};

export const OrderedListItem = ({ children, index }) => {
  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>
        {index + 1}. &nbsp;<Text>{children}</Text>
      </Text>
    </View>
  );
};
