import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { DarkDefault, LightDefault } from "./src/themes/themes";
import TabNav from "./src/navigators/BottomNav";
import "react-native-url-polyfill/auto";
import * as Db from "./src/db/Db";
import { queries } from "./src/db/queries";

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? DarkDefault : LightDefault;
  const db = Db.getConnection();
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    queries.forEach((value, key) => {
      if (key.startsWith("createTable")) {
        db.transaction((tx) => tx.executeSql(value));
      }
    });
  }, []);

  return (
    <NavigationContainer theme={theme}>
      <TabNav />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
