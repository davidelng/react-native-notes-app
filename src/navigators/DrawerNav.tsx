import "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerNavigationOptions } from "@react-navigation/drawer";
import Home from "../screens/Home";

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  const { colors } = useTheme();

  const screenOptions: DrawerNavigationOptions = {
    drawerStyle: {
      backgroundColor: colors.border,
    },
  };

  return (
    <Drawer.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: "Note",
          headerTitleAlign: "center",
          headerTintColor: colors.text,
        }}
      />
    </Drawer.Navigator>
  );
}
