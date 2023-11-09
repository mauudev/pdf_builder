import React from "react";
import { Text, Link, View, StyleSheet } from "@react-pdf/renderer";
import redraft from "redraft";
import {
  Paragraph,
  HeadingOne,
  UnorderedList,
  OrderedList,
  OrderedListItem,
  UnorderedListItem,
} from "../../ui";

const styles = StyleSheet.create({
  text: {
    marginBottom: 8,
    color: "red",
    fontFamily: "Public Sans",
    fontSize: 10,
    lineHeight: 1.45,
  },
});

const renderers = {
  inline: {
    // The key passed here is just an index based on rendering order inside a block
    BOLD: (children, { key }) => {
      return (
        <Text key={`bold-${key}`} style={{ fontWeight: 700 }}>
          {children}
        </Text>
      );
    },
    ITALIC: (children, { key }) => {
      return (
        <Text key={`italic-${key}`} style={{ fontStyle: "italic" }}>
          {children}
        </Text>
      );
    },
    UNDERLINE: (children, { key }) => {
      return (
        <Text key={`underline-${key}`} style={{ textDecoration: "underline" }}>
          {children}
        </Text>
      );
    },
  },
  /**
   * Blocks receive children and depth
   * Note that children are an array of blocks with same styling,
   */
  blocks: {
    unstyled: (children, { keys }) => {
      return children.map((child, index) => {
        return (
          <View key={keys[index]}>
            <Text style={styles.text}>{child}</Text>
          </View>
        );
      });
    },
    // unstyled: (children, { keys }) => {
    //   return children.map((child, index) => {
    //     console.log(`CHILD: ${child}`);
    //     return <Paragraph key={keys[index]}>{child}</Paragraph>;
    //   });
    // },
    "header-one": (children, { keys }) => {
      console.log(`CHILDREN: ${JSON.stringify(children)}`);
      return children.map((child, index) => {
        // return <HeadingOne key={keys[index]}>{child}</HeadingOne>;
        return child;
      });
    },
    "unordered-list-item": (children, { depth, keys }) => {
      return (
        <UnorderedList key={keys[keys.length - 1]} depth={depth}>
          {children.map((child, index) => (
            <UnorderedListItem key={keys[index]}>{child}</UnorderedListItem>
          ))}
        </UnorderedList>
      );
    },
    "ordered-list-item": (children, { depth, keys }) => {
      return (
        <OrderedList key={keys.join("|")} depth={depth}>
          {children.map((child, index) => (
            <OrderedListItem key={keys[index]} index={index}>
              {child}
            </OrderedListItem>
          ))}
        </OrderedList>
      );
    },
  },
  /**
   * Entities receive children and the entity data
   */
  entities: {
    // key is the entity key value from raw
    LINK: (children, data, { key }) => (
      <Link key={key} src={data.url}>
        {children}
      </Link>
    ),
  },
};

const options = {
  cleanup: {
    after: "all",
    types: "all",
    split: true,
  },
};

const RichText = ({ rawContent }) => {
  console.log(`RAW CONTENT: ${JSON.stringify(rawContent)}`);
  return redraft(rawContent, renderers, options);
};

export default RichText;
