import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNav from "./DrawerNav";
import Editor from "../screens/Editor";
import Settings from "../screens/Settings";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function StackNav() {
  const screenOptions: NativeStackNavigationOptions = {
    headerShadowVisible: false,
    headerTitleStyle: {
      fontWeight: "bold",
    },
    animation: "slide_from_right",
  };

  return (
    <Stack.Navigator initialRouteName="Drawer" screenOptions={screenOptions}>
      <Stack.Screen
        name="Drawer"
        component={DrawerNav}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Editor"
        component={Editor}
        options={{
          headerTitle: "Editor",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="Impostazioni"
        component={Settings}
        options={{
          headerTitle: "Impostazioni",
          headerTitleAlign: "center",
          // drawerIcon: () => (
          //   <Feather name="settings" size={24} style={{ color: colors.text }} />
          // ),
        }}
      />
    </Stack.Navigator>
  );
}
