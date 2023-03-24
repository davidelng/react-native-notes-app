import { StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function TrashNoteButton({ navigation }) {
  return (
    <Pressable onPress={() => alert("Delete")} style={styles.button}>
      <Feather name="trash-2" size={24} color="#E0E0E0" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {},
});
