import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function TagBadge({ accent, content }) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors[accent] + "50" }]}
    >
      <View
        style={[styles.decoration, { backgroundColor: colors[accent] }]}
      ></View>
      <Text style={[styles.text, { color: colors.text }]}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 1,
    // paddingHorizontal: 6,
    // paddingVertical: 2,
    gap: 3,
  },
  decoration: {
    height: 6,
    width: 6,
    borderRadius: 50,
  },
  text: {
    // paddingHorizontal: 6,
    // textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 10,
  },
});
