import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as Db from "../db/Db";
import { queries } from "../db/queries";
import { AntDesign, Feather } from "@expo/vector-icons";

export default function Settings({ navigation }) {
  const { colors } = useTheme();
  const db = Db.getConnection();

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
        <TextInput
          onChangeText={(text) => {}}
          placeholder="La tua chiave API"
          placeholderTextColor={colors.text + "99"}
          style={{
            borderBottomWidth: 1,
            borderStyle: "solid",
            borderColor: colors.text + "50",
            // borderRadius: 8,
            padding: 10,
          }}
        />
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
