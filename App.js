import { useState, useCallback } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import mockData from "./mock.json";

export default function App() {
  // const [fontsLoaded] = useFonts({
  //   Poppins: require("./assets/fonts/Poppins-Regular.ttf"),
  // });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  // if (!fontsLoaded) {
  //   return null;
  // }

  return (
    <NavigationContainer>
      <View>
        <Text>Hello</Text>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
