import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Switch,
} from "react-native";
import { useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import * as Db from "../db/Db";
import { queries } from "../db/queries";
import { updateApiKey } from "../lib/openai";
import * as Themes from "../themes/themes";
import { AntDesign, Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";

let lightThemes = [];
let darkThemes = [];
for (let t in Themes) {
  if (Themes[t].dark) {
    darkThemes.push({ [t]: Themes[t] });
  } else {
    lightThemes.push({ [t]: Themes[t] });
  }
}

export default function Settings({ navigation }) {
  const { colors } = useTheme();
  const [openaiKey, setOpenaiKey] = useState(null);
  const [useSystemTheme, setUseSystemTheme] = useState(null);
  const [isAIEditing, setIsAIEditing] = useState(false);
  const db = Db.getConnection();

  useEffect(() => {
    getSystemThemePreference();
    getOpenaiKey();
  }, [navigation]);

  function getOpenaiKey() {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("getConf"),
        ["OPENAI_API_KEY"],
        (tx, res) => {
          if (res.rows._array.length > 0) {
            setOpenaiKey(res.rows.item(0).value);
          }
        },
        (tx, err) => {
          return false;
        }
      )
    );
  }

  function getSystemThemePreference() {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("getConf"),
        ["USE_SYSTEM_THEME"],
        (tx, res) => {
          if (res.rows._array.length > 0) {
            let val = res.rows.item(0).value === "enabled" ? true : false;
            setUseSystemTheme(val);
          } else {
            setUseSystemTheme(true);
          }
        },
        (tx, err) => {
          return false;
        }
      )
    );
  }

  function updateSystemThemePreference(value: boolean) {
    let val = value ? "enabled" : "disabled";
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("upsertConf"),
        ["USE_SYSTEM_THEME", val],
        (tx, res) => {
          setUseSystemTheme(value);
          return true;
        },
        (tx, err) => {
          return false;
        }
      )
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text
          style={[
            styles.heading,
            { color: colors.text + "99", marginBottom: 0 },
          ]}
        >
          Aspetto
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[styles.text, { color: colors.text }]}>
            Usa preferenze di sistema per il tema
          </Text>
          <Switch
            // trackColor={{ false: "#767577", true: "#81b0ff" }}
            // thumbColor={systemTheme ? "#f5dd4b" : "#f4f3f4"}
            trackColor={{ false: colors.button, true: colors.green }}
            thumbColor={colors.text}
            onValueChange={(val) => updateSystemThemePreference(val)}
            value={useSystemTheme}
          />
        </View>
        {useSystemTheme ? (
          <>
            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: colors.primary + "80",
                padding: 10,
                borderRadius: 20,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: colors.primary, textAlign: "center" }}>
                Scegli tema chiaro
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: colors.primary + "80",
                padding: 10,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: colors.primary, textAlign: "center" }}>
                Scegli tema scuro
              </Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: colors.primary + "80",
              padding: 10,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: colors.primary, textAlign: "center" }}>
              Scegli tema unico
            </Text>
          </Pressable>
        )}
      </View>
      {/* <View style={styles.section}>
        <Text style={[styles.heading, { color: colors.text + "99" }]}>
          Note
        </Text>
        <Text style={{ color: colors.text }}>Ordina le note per</Text>
        <Text style={{ color: colors.text }}>Ordina le note in modo</Text>
      </View>
      <View style={styles.section}>
        <Text style={[styles.heading, { color: colors.text + "99" }]}>
          Database
        </Text>
        <Text style={{ color: colors.text }}>Svuota il db</Text>
        <Text style={{ color: colors.text }}>Esporta db</Text>
        <Text style={{ color: colors.text }}>Importa db</Text>
      </View> */}
      <View style={styles.section}>
        <Text style={[styles.heading, { color: colors.text + "99" }]}>AI</Text>
        <View>
          {isAIEditing ? (
            <View
              style={[
                styles.AITextField,
                { backgroundColor: colors.primary + "80" },
              ]}
            >
              <TextInput
                value={openaiKey}
                onChangeText={(text) => setOpenaiKey(text)}
                placeholder="La tua chiave API"
                placeholderTextColor={colors.text + "99"}
                style={{ color: colors.text, flex: 1 }}
              />
              <Pressable
                onPress={() => {
                  updateApiKey(openaiKey);
                  setIsAIEditing(false);
                }}
              >
                <Feather name="save" size={24} style={{ color: colors.text }} />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setIsAIEditing(true)}
              style={{
                backgroundColor: colors.primary + "80",
                padding: 10,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: colors.primary, textAlign: "center" }}>
                {openaiKey ? "Modifica" : "Aggiungi"} chiave API
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.heading, { color: colors.text + "99" }]}>
          Crediti
        </Text>
        <Pressable
          onPress={() =>
            Linking.openURL(
              "https://github.com/davidelng/react-native-notes-app"
            )
          }
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <AntDesign name="github" size={24} color={colors.text} />
          <Text style={{ color: colors.text, fontSize: 16 }}>GitHub</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
  },
  AITextField: {
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
    display: "flex",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
});
