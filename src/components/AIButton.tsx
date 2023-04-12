import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function AIButton({ onPress }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress}>
      <MaterialCommunityIcons
        name="text-recognition"
        size={24}
        color={colors.text}
      />
    </Pressable>
  );
}
