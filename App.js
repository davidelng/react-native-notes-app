import "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { CustomDarkTheme, CustomDefaultTheme } from "./src/themes/themes";
import Home from "./src/screens/Home";
import Editor from "./src/screens/Editor";
import MenuButton from "./src/components/MenuButton";
import SearchButton from "./src/components/SearchButton";
import TrashNoteButton from "./src/components/TrashNoteButton";

const Stack = createNativeStackNavigator();

export default function App() {
  const scheme = useColorScheme();

  const screenOptions = {
    headerShadowVisible: false,
    headerTitleStyle: {
      fontWeight: "bold",
    },
    animation: "slide_from_right",
  };

  return (
    <NavigationContainer
      theme={scheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
    >
      <Stack.Navigator initialRouteName="Root" screenOptions={screenOptions}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerTitle: "",
            headerLeft: () => <MenuButton />,
            headerRight: () => <SearchButton />,
          }}
        />
        <Stack.Screen
          name="Editor"
          component={Editor}
          options={{
            headerTitle: "",
            headerRight: () => <TrashNoteButton />,
          }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
