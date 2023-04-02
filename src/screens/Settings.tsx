import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function Settings({ navigation }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
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
        <Text style={{ color: colors.text }}>GitHub</Text>
      </View>
    </View>
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
