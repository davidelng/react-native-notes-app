import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function Settings({ navigation }) {
  const { colors } = useTheme();

  return (
    <View>
      <Text style={{ color: colors.text }}>Qua impostiamo cose</Text>
    </View>
  );
}
