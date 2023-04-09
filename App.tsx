import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { DarkDefault, LightDefault } from "./src/themes/themes";
import StackNav from "./src/navigators/StackNav";
import "react-native-url-polyfill/auto";

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? DarkDefault : LightDefault;

  return (
    <NavigationContainer theme={theme}>
      <StackNav />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
