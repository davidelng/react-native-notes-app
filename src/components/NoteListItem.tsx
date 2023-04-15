import { StyleSheet, View, Pressable, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { dateFormatter } from "../lib/dateFormatter";
import { formatPreview } from "../lib/textFormatter";
import TagBadge from "./TagBadge";

export default function NoteListItem({ navigation, data, onPress }) {
  const { colors } = useTheme();
  const timestamp = dateFormatter(data.timestamp);

  // return (
  //   <Pressable
  //     onPress={onPress}
  //     // onLongPress={() => {}}
  //     android_ripple={{
  //       color: colors.backgroundLighter,
  //       borderless: false,
  //       foreground: false,
  //     }}
  //   >
  //     <View style={[styles.container, { borderColor: colors.border + "90" }]}>
  //       <Text style={[styles.title, { color: colors.text }]}>{data.title}</Text>
  //       <Text style={[styles.content, { color: colors.text + "d2" }]}>
  //         {formatPreview(data.content)}
  //       </Text>
  //       <View style={styles.badgeContainer}>
  //         {data.tag && <TagBadge accent={data.tagColor} content={data.tag} />}
  //         <Text
  //           style={[
  //             styles.date,
  //             { color: colors.notification, marginLeft: "auto" },
  //           ]}
  //         >
  //           {timestamp}
  //         </Text>
  //       </View>
  //     </View>
  //   </Pressable>
  // );

  return (
    <Pressable
      onPress={onPress}
      // onLongPress={() => {}}
      android_ripple={{
        color: colors.backgroundLighter,
        borderless: false,
        foreground: false,
      }}
    >
      <View style={[styles.container, { borderColor: colors.border + "90" }]}>
        <Text style={[styles.title, { color: colors.text, fontWeight: "600" }]}>
          {data.title}
        </Text>
        <View
          style={[
            styles.badgeContainer,
            {
              marginBottom: 8,
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 6,
            },
          ]}
        >
          <Text style={{ color: colors.notification }}>{timestamp}</Text>
          {data.tag && <TagBadge accent={data.tagColor} content={data.tag} />}
        </View>
        {data.content !== "" && (
          <Text
            style={[
              styles.content,
              { color: colors.text + "d2", marginBottom: 0 },
            ]}
          >
            {formatPreview(data.content)}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    borderBottomWidth: 2,
    borderStyle: "dashed",
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
