import { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, Pressable, TextInput } from "react-native";

export default function Editor() {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.title}
        placeholder="Title"
        placeholderTextColor="#E0E0E0"
      />
      <TextInput
        style={styles.content}
        placeholder="Content"
        placeholderTextColor="#E0E0E0"
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    padding: 16,
    borderBottomColor: "#212121",
    borderBottomWidth: 1,
    fontSize: 20,
  },
  content: {
    padding: 16,
  },
});
