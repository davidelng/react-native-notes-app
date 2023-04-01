import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import TagsList from "./TagsList";

export default function DrawerMenu(props) {
  const { colors } = useTheme();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <DrawerItemList {...props} />
      {/* <TagsList /> */}
      {/* <DrawerItem
        label="Impostazioni"
        onPress={() => alert("Impostazioni")}
        icon={() => (
          <Feather name="settings" size={24} style={{ color: colors.text }} />
        )}
      /> */}
    </DrawerContentScrollView>
  );
}
