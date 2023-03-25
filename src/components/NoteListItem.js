import { StyleSheet, View, Pressable, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function NoteListItem({ navigation, data, onPress }) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, { borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>{data.title}</Text>
        <Text style={[styles.content, { color: colors.text }]}>
          {data.content}
        </Text>
        <View style={styles.badgeContainer}>
          <Text
            style={[
              styles.badge,
              { color: colors.primary, backgroundColor: colors.primary + "50" },
            ]}
          >
            {data.category}
          </Text>
          <Text style={[styles.date, { color: colors.notification }]}>
            25-03-2023
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  content: {
    marginBottom: 10,
  },
  badgeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  badge: {
    paddingHorizontal: 6,
    borderRadius: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 12,
  },
  date: {
    fontSize: 10,
  },
});
