import { StyleSheet, View, Pressable, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

function dateFormatter(date: string) {
  let timestamp: Date | string = new Date(date);
  let now = new Date();
  let delta = Math.floor(
    (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
  );

  if (delta < 1) {
    let minuti = Math.floor((now.getTime() - timestamp.getTime()) / 60000);
    timestamp = minuti > 1 ? minuti + " minuti fa" : "Meno di un minuto fa";
  } else if (delta === 1) {
    timestamp = "Un'ora fa";
  } else if (delta < 24) {
    timestamp = delta + " ore fa";
  } else {
    timestamp = timestamp.toLocaleString("it-IT", {
      hour: "numeric",
      minute: "numeric",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return timestamp;
}

export default function NoteListItem({ navigation, data, onPress }) {
  const { colors } = useTheme();
  const timestamp = dateFormatter(data.timestamp);

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, { borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>{data.title}</Text>
        <Text style={[styles.content, { color: colors.text }]}>
          {data.content}
        </Text>
        <View style={styles.badgeContainer}>
          {data.category && (
            <Text
              style={[
                styles.badge,
                {
                  color: colors.primary,
                  backgroundColor: colors.primary + "50",
                },
              ]}
            >
              {data.category}
            </Text>
          )}
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
