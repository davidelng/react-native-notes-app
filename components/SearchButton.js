import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function SearchButton() {
  const { colors } = useTheme();

  return (
    <Pressable onPress={() => alert("Search")}>
      <Feather name="search" size={24} style={{ color: colors.text }} />
    </Pressable>
  );
}
