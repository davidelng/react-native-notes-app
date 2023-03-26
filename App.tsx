import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { DarkDefault, LightDefault } from "./src/themes/themes";
import StackNav from "./src/navigators/StackNav";

export default function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === "dark" ? DarkDefault : LightDefault}>
      <StackNav />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
