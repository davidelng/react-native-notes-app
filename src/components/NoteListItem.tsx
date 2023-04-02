import { StyleSheet, View, Pressable, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { dateFormatter } from "../lib/dateUtils";
import TagBadge from "./TagBadge";

export default function NoteListItem({ navigation, data, onPress }) {
  const { colors } = useTheme();
  const timestamp = dateFormatter(data.timestamp);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={() => alert("Long press!")}
      android_ripple={{
        color: colors.backgroundLighter,
        borderless: false,
        foreground: false,
      }}
    >
      <View style={[styles.container, { borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>{data.title}</Text>
        <Text style={[styles.content, { color: colors.text + "d2" }]}>
          {data.content.length > 120
            ? data.content.slice(0, 120) + "..."
            : data.content}
        </Text>
        <View style={styles.badgeContainer}>
          {data.tag && <TagBadge accent={data.tag_color} content={data.tag} />}
          <Text
            style={[
              styles.date,
              { color: colors.notification, marginLeft: "auto" },
            ]}
          >
            {timestamp}
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
  date: {
    fontSize: 10,
  },
});
