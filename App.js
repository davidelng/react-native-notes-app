import { useState } from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { CustomDarkTheme, CustomDefaultTheme } from "./themes";
import Home from "./components/Home";
import Editor from "./components/Editor";
import MenuButton from "./components/MenuButton";
import SearchButton from "./components/SearchButton";
import TrashNoteButton from "./components/TrashNoteButton";

const Stack = createNativeStackNavigator();

export default function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer
      theme={scheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
    >
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          animation: "slide_from_right",
        }}
      >
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
