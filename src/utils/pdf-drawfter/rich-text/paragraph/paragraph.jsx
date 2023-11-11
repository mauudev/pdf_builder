import React from "react";
import { View, Text } from "@react-pdf/renderer";

export const Paragraph = ({styles, children }) => {
  <View style={...styles}>
    <Text>{children}</Text>
  </View>;
};
