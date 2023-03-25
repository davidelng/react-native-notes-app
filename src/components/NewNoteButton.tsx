import { StyleSheet, Pressable, useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function NewNoteButton({ navigation }) {
  const { colors } = useTheme();
  const scheme = useColorScheme();

  return (
    <Pressable
      onPress={() => navigation.navigate("Editor")}
      style={[styles.button, { backgroundColor: colors.primary }]}
    >
      <Feather
        name="edit-2"
        size={24}
        style={
          scheme === "dark" ? { color: colors.text } : { color: colors.card }
        }
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 16,
    right: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 50,
  },
});
