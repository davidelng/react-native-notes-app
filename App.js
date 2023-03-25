import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { CustomDarkTheme, CustomDefaultTheme } from "./src/themes/themes";
import StackNav from "./src/navigators/StackNav";

export default function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer
      theme={scheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
    >
      <StackNav />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
