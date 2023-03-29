import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { DarkDefault, LightDefault } from "./src/themes/themes";
import StackNav from "./src/navigators/StackNav";
import * as Db from "./src/db/Db";
import { queries } from "./src/db/queries";

export default function App() {
  const scheme = useColorScheme();
  // const db = Db.getConnection("notes.sqlite");

  useEffect(() => {
    // queries.forEach((value, key) => {
    //   if (key.startsWith("createTable")) {
    //     db.transaction((tx) => tx.executeSql(value));
    //   }
    // });
    //   db.transaction((tx) => {
    //     tx.executeSql(
    //       queries.get("getAllNotes"),
    //       null,
    //       (txObj, result) => {
    //         setNotes(result.rows._array);
    //       },
    //       (txObj, err) => {
    //         return false;
    //       }
    //     );
    //   });
  }, []);

  return (
    <NavigationContainer theme={scheme === "dark" ? DarkDefault : LightDefault}>
      <StackNav />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
