import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as Themes from "./src/themes/themes";
import TabNav from "./src/navigators/BottomNav";
import "react-native-url-polyfill/auto";
import * as Db from "./src/db/Db";
import { queries } from "./src/db/queries";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
// import { useFonts } from "expo-font";

export default function App() {
  const db = Db.getConnection();
  const scheme = useColorScheme();
  const [isUsingScheme, setIsUsingScheme] = useState(null);
  const [defaultTheme, setDefaultTheme] = useState(null);
  const [lightTheme, setLightTheme] = useState(null);
  const [darkTheme, setDarkTheme] = useState(null);

  // db.transaction((tx) =>
  //   tx.executeSql(
  //     queries.get("getAllConf"),
  //     null,
  //     (txObj, res) => {
  //       if (res.rows._array.length > 0) {
  //         for (let conf of res.rows._array) {
  //           if (conf.key === "USE_SYSTEM_THEME" && conf.value === "enabled") {
  //             setIsUsingScheme(true);
  //           } else {
  //             setIsUsingScheme(false);
  //           }
  //           if (conf.key === "DEFAULT_THEME_CHOICE") {
  //             setDefaultTheme(conf.value);
  //           } else if (conf.key === "LIGHT_THEME_CHOICE") {
  //             setLightTheme(conf.value);
  //           } else if (conf.key === "DARK_THEME_CHOICE") {
  //             setDarkTheme(conf.value);
  //           }
  //         }
  //       }
  //       return true;
  //     },
  //     (txObj, err) => {
  //       return false;
  //     }
  //   )
  // );

  // let theme = defaultTheme ? Themes[defaultTheme] : Themes.DarkDefault;
  // if (isUsingScheme) {
  //   let dark = darkTheme ? Themes[darkTheme] : Themes.DarkDefault;
  //   let light = lightTheme ? Themes[lightTheme] : Themes.LightDefault;
  //   theme = scheme === "dark" ? dark : light;
  // }
  const theme = scheme === "dark" ? Themes.DarkDefault : Themes.LightDefault;

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

  useEffect(() => {
    queries.forEach((value, key) => {
      if (key.startsWith("createTable")) {
        db.transaction((tx) => tx.executeSql(value));
      }
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={theme}>
        <BottomSheetModalProvider>
          <TabNav />
          <StatusBar style="auto" />
        </BottomSheetModalProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
