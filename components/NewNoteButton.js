import { StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function NewNoteButton({ navigation }) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => navigation.navigate("Editor")}
      style={styles.button}
    >
      <Feather name="edit-2" size={24} style={{ color: colors.button }} />
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
    backgroundColor: "#427DDE",
    borderRadius: 50,
  },
});
