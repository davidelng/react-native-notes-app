import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
} from "react-native";
import { useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import * as Db from "../db/Db";
import { queries } from "../db/queries";
import { AntDesign, Feather } from "@expo/vector-icons";
import { updateApiKey } from "../lib/openai";

export default function Settings({ navigation }) {
  const { colors } = useTheme();
  const [openaiKey, setOpenaiKey] = useState("");
  const db = Db.getConnection();

  useEffect(() => {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("getConf"),
        ["OPENAI_API_KEY"],
        (tx, res) => {
          setOpenaiKey(res.rows.item(0).value);
        },
        (tx, err) => {
          return false;
        }
      )
    );
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.heading, { color: colors.text + "99" }]}>
          Aspetto
        </Text>
        <Text style={{ color: colors.text }}>Tema scuro</Text>
        <Text style={{ color: colors.text }}>Tema chiaro</Text>
        <Text style={{ color: colors.text }}>
          Usa preferenze di sistema per il tema
        </Text>
        <Text style={{ color: colors.text }}>Tema default</Text>
        <Text style={{ color: colors.text }}>Stile dei tag</Text>
      </View>
      <View style={styles.section}>
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
      </View>
      <View style={styles.section}>
        <Text style={[styles.heading, { color: colors.text + "99" }]}>AI</Text>
        <Text style={{ color: colors.text, marginBottom: 10 }}>
          Chiave OpenAI
        </Text>
        <View>
          <TextInput
            value={openaiKey}
            onChangeText={(text) => setOpenaiKey(text)}
            placeholder="La tua chiave API"
            placeholderTextColor={colors.text + "99"}
            style={{
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: colors.text + "50",
              // borderRadius: 8,
              padding: 10,
              color: colors.text,
              marginBottom: 10,
            }}
          />
          <Button title="salva" onPress={() => updateApiKey(openaiKey)} />
        </View>
      </View>
      <View style={styles.section}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <AntDesign name="github" size={24} color={colors.text} />
          {/* <Feather name="github" size={24} color={colors.text} /> */}
          <Text style={{ color: colors.text }}>GitHub</Text>
        </View>
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
    marginBottom: 12,
  },
});
