import { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, Pressable, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function Editor() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.title, { borderBottomColor: colors.border }]}
        placeholder="Title"
        placeholderTextColor={colors.text}
      />
      <TextInput
        style={styles.content}
        placeholder="Content"
        placeholderTextColor={colors.text}
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
    borderBottomWidth: 1,
    fontSize: 20,
  },
  content: {
    padding: 16,
  },
});
