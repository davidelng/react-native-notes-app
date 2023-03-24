import { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, Pressable, Text, FlatList } from "react-native";

export default function NoteListItem({ navigation, data, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.content}>{data.content}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>{data.category}</Text>
          <Text style={styles.date}>25-03-2023</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    borderBottomColor: "#212121",
    borderBottomWidth: 1,
  },
  title: {
    color: "#E0E0E0",
    fontSize: 18,
    marginBottom: 8,
  },
  content: {
    color: "#E0E0E0",
    marginBottom: 10,
  },
  badgeContainer: {
    display: "flex",
    // alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  badge: {
    color: "#427DDE",
    backgroundColor: "#427DDE50",
    paddingHorizontal: 8,
    borderRadius: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 12,
    // borderColor: "#427DDE",
    // borderWidth: 1,
  },
  date: {
    color: "#9F9F9F",
    fontSize: 10,
  },
});
