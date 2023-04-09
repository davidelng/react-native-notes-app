import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

const dbName = "notes.sqlite";

const conn = SQLite.openDatabase(dbName);

// class Db {
//   getConnection() {
//     if (Platform.OS === "web") {
//       return {
//         transaction: () => {
//           return {
//             executeSql: () => {},
//           };
//         },
//       };
//     }
//     return conn;
//   }
// }

// module.exports = new Db();

export function getConnection() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }
  return conn;
}
