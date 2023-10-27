import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "./paragraph.styles";

export const Paragraph = ({ children }) => {
  <View>
    <Text style={styles.text}>{children}</Text>
  </View>;
};
