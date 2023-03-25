import { StyleSheet, View, FlatList, Text, useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

const mock = [
  {
    id: 1,
    label: "dev",
    color: "#427DDE",
  },
  {
    id: 2,
    label: "life",
    color: "#84CC16",
  },
  {
    id: 3,
    label: "stuff",
    color: "#FF6347",
  },
];

export default function TagsList() {
  const { colors } = useTheme();
  const scheme = useColorScheme();

  const renderTag = ({ item }) => {
    return (
      <View style={styles.badgeContainer}>
        <Text
          style={[
            styles.badge,
            { color: item.color, backgroundColor: item.color + "50" },
          ]}
        >
          {item.label}
        </Text>
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
      style={[
        styles.container,
        { backgroundColor: scheme === "dark" ? "#181818" : "#B8B8B8" },
      ]}
    >
      <View style={styles.header}>
        <Feather name="tag" size={24} style={{ color: colors.text }} />
        <Text style={{ color: colors.text, marginRight: "auto" }}>Tags</Text>
        <Feather name="plus" size={18} style={{ color: colors.text + "80" }} />
      </View>
      <FlatList
        data={mock}
        renderItem={renderTag}
        keyExtractor={(item) => item.id}
        // extraData={selectedId}
      />
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
    // backgroundColor: "#181818",
    // marginTop: 16,
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
