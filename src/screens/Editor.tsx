import { StyleSheet, View, Text, TextInput, Alert } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import * as Db from "../db/Db";

export default function Editor({ navigation }) {
  const [text, setText] = useState("");
  const db = Db.getConnection("notes.sqlite");

  const { colors } = useTheme();
  const datetime = new Date().toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.date, { color: colors.text }]}>{datetime}</Text>
      <TextInput
        style={[
          styles.title,
          { borderBottomColor: colors.border, color: colors.text },
        ]}
        placeholder="Title"
        placeholderTextColor={colors.text}
        value={text}
        onChangeText={(text) => setText(text)}
      />
      <TextInput
        style={[styles.content, { color: colors.text }]}
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
  date: {
    fontSize: 12,
    paddingHorizontal: 16,
    opacity: 0.7,
  },
});
