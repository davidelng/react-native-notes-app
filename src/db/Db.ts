import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

export function getConnection(dbname: string) {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase(dbname);
  return db;
}
