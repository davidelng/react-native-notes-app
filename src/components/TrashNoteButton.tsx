import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function TrashNoteButton({ onPress }) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress}>
      <Feather name="trash-2" size={24} style={{ color: colors.text }} />
    </Pressable>
  );
}
