import { View, Text, Image } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function Title({ title }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        gap: 16,
      }}
    >
      <Image
        source={require("../../assets/logoapp.png")}
        style={{ width: 30, height: 30 }}
      />
      <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 20 }}>
        {title}
      </Text>
    </View>
  );
}
