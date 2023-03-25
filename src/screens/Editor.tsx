import { StyleSheet, View, Text, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function Editor() {
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
  date: {
    fontSize: 12,
    paddingHorizontal: 16,
    opacity: 0.7,
  },
});
