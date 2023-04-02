import { StyleSheet, Pressable, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { color } from "react-native-reanimated";

export default function NewNoteButton({ navigation }) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => navigation.navigate("Editor")}
      style={[styles.button, { backgroundColor: colors.primary }]}
    >
      <Feather name="edit-2" size={24} style={{ color: colors.button }} />
    </Pressable>
    // <Pressable
    //   onPress={() => navigation.navigate("Editor")}
    //   style={[
    //     styles.button,
    //     {
    //       backgroundColor: colors.primary + "50",
    //       borderWidth: 1,
    //       borderColor: colors.primary,
    //       borderStyle: "solid",
    //       display: "flex",
    //       flexDirection: "row",
    //       alignItems: "center",
    //       gap: 12,
    //     },
    //   ]}
    // >
    //   <Text style={{ color: colors.text }}>Scrivi</Text>
    //   <Feather name="edit-2" size={20} style={{ color: colors.button }} />
    // </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 16,
    right: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 50,
  },
});
