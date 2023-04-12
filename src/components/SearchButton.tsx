import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function SearchButton() {
  const { colors } = useTheme();

  return (
    <Pressable onPress={() => {}}>
      <Feather
        name="search"
        size={24}
        style={{ color: colors.primary + "80", marginRight: 16 }}
      />
    </Pressable>
  );
}
