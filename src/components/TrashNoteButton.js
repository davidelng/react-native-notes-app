import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function TrashNoteButton({ navigation }) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={() => alert("Delete")}>
      <Feather name="trash-2" size={24} style={{ color: colors.text }} />
    </Pressable>
  );
}
