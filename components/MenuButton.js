import { StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function MenuButton({ navigation }) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={() => alert("This is a button!")}>
      <Feather name="menu" size={24} style={{ color: colors.text }} />
    </Pressable>
  );
}
