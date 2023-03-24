import { useState, useCallback, useEffect } from "react";
import { StyleSheet, Pressable } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";
import mockData from "./mock.json";
import Home from "./components/Home";
import Editor from "./components/Editor";
import MenuButton from "./components/MenuButton";
import TrashNoteButton from "./components/TrashNoteButton";

const Stack = createNativeStackNavigator();

const CustomTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: "#427DDE",
    background: "#000000",
    card: "#212121",
    border: "#212121",
    text: "#E0E0E0",
  },
};

export default function App() {
  return (
    <NavigationContainer theme={CustomTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#fff",
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
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
