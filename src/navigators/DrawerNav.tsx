import "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerNavigationOptions } from "@react-navigation/drawer";
import Home from "../screens/Home";
import DrawerMenu from "../components/DrawerMenu";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SearchButton from "../components/SearchButton";

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  const { colors } = useTheme();

  const screenOptions: DrawerNavigationOptions = {
    drawerStyle: {
      backgroundColor: colors.border,
    },
    // drawerActiveBackgroundColor: colors.notification + "20",
    drawerActiveBackgroundColor: "transparent",
    drawerActiveTintColor: colors.text,
  };

  return (
    <Drawer.Navigator
      initialRouteName="Note"
      screenOptions={screenOptions}
      drawerContent={DrawerMenu}
    >
      <Drawer.Screen
        name="Note"
        component={Home}
        options={{
          headerTitle: "Note",
          headerTitleAlign: "center",
          headerTintColor: colors.text,
          headerRight: () => <SearchButton />,
          drawerIcon: () => (
            <MaterialCommunityIcons
              name="notebook-outline"
              size={24}
              color={colors.text}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
