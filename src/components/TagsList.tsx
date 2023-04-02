import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import * as Db from "../db/Db";
import { queries } from "../db/queries";
import { useEffect, useState } from "react";
import TagBadge from "./TagBadge";

export default function TagsList({ navigation }) {
  const { colors } = useTheme();
  const [tags, setTags] = useState(null);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState({ name: "", color: "" });

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

  function addNewTag() {
    if (newTag.name !== "") {
      setTagModalVisible(false);
      db.transaction((tx) => {
        tx.executeSql(
          queries.get("insertTag"),
          [newTag.name, "primary"],
          (txObj, res) => {
            return true;
          },
          (txObj, err) => {
            alert(err.message);
            return false;
          }
        );
      });
    }
  }

  // const renderTag = ({ item }) => {
  //   return (
  //     <View style={styles.badgeContainer}>
  //       <TagBadge accent={item.color} content={item.name} />
  //       <Feather
  //         name="chevron-right"
  //         size={18}
  //         style={{ color: colors.text + "80" }}
  //       />
  //     </View>
  //   );
  // };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundLighter }]}
    >
      <View style={styles.header}>
        <Feather name="tag" size={20} style={{ color: colors.text + "80" }} />
        <Text style={{ color: colors.text + "80", marginRight: "auto" }}>
          Tags
        </Text>
        <Pressable onPress={() => setTagModalVisible(true)}>
          <Feather
            name="plus"
            size={18}
            style={{ color: colors.text + "80" }}
          />
        </Pressable>
      </View>
      {/* {tags && (
        <FlatList
          data={tags}
          renderItem={renderTag}
          keyExtractor={(item) => item.id}
          // extraData={}
        />
      )} */}
      {tags &&
        tags.map((tag) => {
          return (
            <View style={styles.badgeContainer} key={tag.id}>
              <TagBadge accent={tag.color} content={tag.name} />
              <Feather
                name="chevron-right"
                size={18}
                style={{ color: colors.text + "80" }}
              />
            </View>
          );
        })}
      {/* NEW TAG MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={tagModalVisible}
        onRequestClose={() => {
          setTagModalVisible(!tagModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <Pressable
            onPress={() => setTagModalVisible(false)}
            style={{ flex: 1 }}
          />
          <View
            style={[
              styles.modalView,
              { backgroundColor: "#303030", minHeight: "60%" },
            ]}
          >
            <TextInput
              style={{
                color: colors.text,
                padding: 16,
                borderColor: colors.text + "80",
                borderRadius: 4,
                borderStyle: "solid",
                borderWidth: 1,
              }}
              placeholder="Nome del nuovo tag"
              placeholderTextColor={colors.text + "80"}
              value={newTag.name}
              onChangeText={(text) =>
                setNewTag((prev) => {
                  return { ...prev, name: text };
                })
              }
            />
            <View
              style={{
                marginVertical: 24,
                display: "flex",
                flexDirection: "row",
                gap: 16,
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Pressable
                onPress={() => {
                  setTagModalVisible(false);
                }}
              >
                <Text style={{ color: colors.text }}>Annulla</Text>
              </Pressable>
              <Pressable onPress={addNewTag}>
                <Text style={{ color: colors.text }}>Salva</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* NEW TAG MODAL */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: "#303030",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
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
  centeredView: {
    flex: 1,
    marginTop: 22,
  },
  modalView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    width: "100%",
  },
});
