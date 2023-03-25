import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/Home";

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  const screenOptions = {
    drawerStyle: {
      backgroundColor: "#151515",
    },
  };

  return (
    <Drawer.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ headerTitle: "", headerTintColor: "#fff" }}
      />
    </Drawer.Navigator>
  );
}
