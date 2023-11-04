import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "./heading-one.styles";

export const HeadingOne = ({ children }) => {
  return (
    <View>
      <Text style={styles.headingOne}>{children}</Text>
    </View>
  );
};
