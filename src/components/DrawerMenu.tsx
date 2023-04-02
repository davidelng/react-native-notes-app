import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import TagsList from "./TagsList";
import { View, Pressable, Text, StyleSheet } from "react-native";

export default function DrawerMenu(props) {
  const { colors } = useTheme();
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* <DrawerItemList {...props} /> */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          marginTop: 24,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "bold" }}>
          NativeNotes
        </Text>
        <Pressable onPress={() => navigation.navigate("Impostazioni")}>
          <Feather name="settings" size={24} style={{ color: colors.text }} />
        </Pressable>
      </View>
      <View>
        <Pressable
          onPress={() => navigation.navigate("Tutte le note")}
          style={[
            styles.header,
            { backgroundColor: colors.backgroundLighter, paddingTop: 32 },
          ]}
        >
          <MaterialCommunityIcons
            name="notebook-outline"
            size={20}
            color={colors.text + "80"}
          />
          <Text style={{ color: colors.text + "80", marginRight: "auto" }}>
            Tutte le note
          </Text>
        </Pressable>
      </View>
      <TagsList navigation={navigation} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    // borderBottomWidth: 1,
    borderColor: "#303030",
  },
});
