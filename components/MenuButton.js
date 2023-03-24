import { StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function MenuButton({ navigation }) {
  return (
    <Pressable onPress={() => alert("This is a button!")}>
      <Feather name="menu" size={24} color="#E0E0E0" />
    </Pressable>
  );
}
