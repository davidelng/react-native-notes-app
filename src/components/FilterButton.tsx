import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function FilterButton({ onPress }) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress}>
      <Feather
        name="filter"
        size={24}
        style={{ color: colors.text, marginRight: 16 }}
      />
    </Pressable>
  );
}
