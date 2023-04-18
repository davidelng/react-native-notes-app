import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as Themes from "./src/themes/themes";
import TabNav from "./src/navigators/TabNav";
import "react-native-url-polyfill/auto";
import * as Db from "./src/db/Db";
import { queries } from "./src/db/queries";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
// import { useFonts } from "expo-font";

export default function App() {
  const db = Db.getConnection();
  const scheme = useColorScheme();
  const [configuration, setConfiguration] = useState({});
  const [theme, setTheme] = useState(Themes.DarkDefault);

  // const theme = scheme === "dark" ? Themes.DarkDefault : Themes.LightDefault;

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

    db.transaction((tx) =>
      tx.executeSql(
        queries.get("getAllConf"),
        null,
        (txObj, res) => {
          if (res.rows._array.length > 0) {
            let allConfs = {};
            for (let conf of res.rows._array) {
              allConfs[conf.key] = conf.value;
            }
            setConfiguration(allConfs);
          }
          return true;
        },
        (txObj, err) => {
          return false;
        }
      )
    );
  }, []);

  useEffect(() => {
    let isUsingScheme = configuration["USE_SYSTEM_THEME"] ?? "notSet";
    let defaultTheme = configuration["DEFAULT_THEME_CHOICE"] ?? "DarkDefault";
    let lightTheme = configuration["LIGHT_THEME_CHOICE"] ?? "LightDefault";
    let darkTheme = configuration["DARK_THEME_CHOICE"] ?? "DarkDefault";

    if (isUsingScheme === "notSet" || isUsingScheme === "enabled") {
      setTheme(scheme === "dark" ? Themes[darkTheme] : Themes[lightTheme]);
    } else {
      setTheme(Themes[defaultTheme]);
    }
  }, [configuration, scheme]);

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
