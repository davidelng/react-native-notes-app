import { StyleSheet, View, FlatList, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import * as Db from "../db/Db";
import { queries } from "../db/queries";
import { useEffect, useState } from "react";
import TagBadge from "./TagBadge";

export default function TagsList({ navigation }) {
  const { colors } = useTheme();
  const [tags, setTags] = useState(null);

  const db = Db.getConnection("notes.sqlite");

  useEffect(() => {
    loadTags();
  }, [navigation]);

  function loadTags() {
    db.transaction((tx) => {
      tx.executeSql(
        queries.get("getAllTags"),
        null,
        (txObj, result) => {
          setTags(result.rows._array);
        },
        (txObj, err) => {
          alert(err.message);
          return false;
        }
      );
    });
  }

  const renderTag = ({ item }) => {
    return (
      <View style={styles.badgeContainer}>
        <TagBadge accent={item.color} content={item.name} />
        <Feather
          name="chevron-right"
          size={18}
          style={{ color: colors.text + "80" }}
        />
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundLighter }]}
    >
      <View style={styles.header}>
        <Feather name="tag" size={24} style={{ color: colors.text }} />
        <Text style={{ color: colors.text, marginRight: "auto" }}>Tags</Text>
        <Feather name="plus" size={18} style={{ color: colors.text + "80" }} />
      </View>
      {tags && (
        <FlatList
          data={tags}
          renderItem={renderTag}
          keyExtractor={(item) => item.id}
          // extraData={}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#303030",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
    marginBottom: 16,
    padding: 4,
    paddingRight: 0,
  },
  badgeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 6,
    borderRadius: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 14,
  },
});
