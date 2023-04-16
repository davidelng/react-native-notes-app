import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useTheme } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { Feather, AntDesign } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import * as Db from "../db/Db";
import { queries } from "../db/queries";
import TagBadge from "./TagBadge";
import { Tag } from "../../types";

export default function TagsList({ navigation }) {
  const { colors } = useTheme();
  const [tags, setTags] = useState(null);
  const [newTag, setNewTag] = useState({ name: "", color: "" });
  const newTagRef = useRef(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const tagColors = ["red", "orange", "yellow", "green", "blue", "purple"];

  const db = Db.getConnection();

  const tagBottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["40%", "80%"], []);
  const handleSheetChanges = useCallback((index: number) => {
    tagBottomSheetRef.current?.snapToIndex(index);
  }, []);
  const openBottomSheet = useCallback(() => {
    tagBottomSheetRef.current?.present();
  }, []);
  const closeBottomSheet = useCallback(() => {
    tagBottomSheetRef.current?.dismiss();
  }, []);

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
      closeBottomSheet();
      db.transaction((tx) => {
        tx.executeSql(
          queries.get("insertTag"),
          [newTag.name, newTag.color],
          (txObj, res) => {
            setNewTag({ name: "", color: "" });
            return true;
          },
          (txObj, err) => {
            alert(err.message);
            return false;
          }
        );
      });
      loadTags();
    }
  }

  function deleteTag() {
    if (selectedTag) {
      setDeleteModalVisible(false);
      db.transaction((tx) => {
        tx.executeSql(
          queries.get("deleteTag"),
          [selectedTag],
          (txObj, res) => {
            setSelectedTag(null);
            loadTags();
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Pressable
        onPress={() => openBottomSheet()}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            flex: 1,
          }}
        >
          <Feather name="tag" size={20} style={{ color: colors.text + "80" }} />
          <Text style={{ color: colors.text + "80" }}>Nuovo</Text>
        </View>
        <Feather name="plus" size={18} style={{ color: colors.text + "80" }} />
      </Pressable>
      {tags &&
        tags.map((tag: Tag) => {
          return (
            <Pressable
              onLongPress={() => {
                Haptics.selectionAsync();
                setSelectedTag(tag.id);
                setDeleteModalVisible(true);
              }}
              onPress={() =>
                navigation.navigate("Tutte le note", { filter: tag.id })
              }
              style={styles.badgeContainer}
              key={tag.id}
            >
              <TagBadge accent={tag.color} content={tag.name} />
              <Feather
                name="chevron-right"
                size={18}
                style={{ color: colors.text + "80" }}
              />
            </Pressable>
          );
        })}

      {/* TAG BOTTOM SHEET */}
      <BottomSheetModal
        ref={tagBottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: colors.backgroundLighter }}
        handleIndicatorStyle={{ backgroundColor: colors.text }}
        keyboardBehavior="extend"
        onDismiss={() => setNewTag({ name: "", color: "" })}
      >
        <View style={styles.bottomSheetView}>
          <View>
            <BottomSheetTextInput
              ref={newTagRef}
              style={{
                color: colors.text,
                paddingHorizontal: 16,
                paddingVertical: 10,
                backgroundColor: colors.notification + "20",
                borderRadius: 50,
                marginBottom: 16,
              }}
              placeholder="Nuova etichetta"
              placeholderTextColor={colors.text + "80"}
              value={newTag.name}
              onChangeText={(text) =>
                setNewTag((prev) => {
                  return { ...prev, name: text };
                })
              }
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {tagColors.map((color) => {
              return (
                <Pressable
                  key={color}
                  style={{
                    width: 28,
                    height: 28,
                    margin: 10,
                    borderRadius: 50,
                    backgroundColor: colors[color],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() =>
                    setNewTag((prev) => {
                      return { ...prev, color: color };
                    })
                  }
                >
                  {newTag.color === color && (
                    <Feather
                      name="check"
                      size={20}
                      style={{ color: colors.text }}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
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
              onPress={addNewTag}
              style={[
                styles.button,
                { backgroundColor: colors.primary + "80" },
              ]}
            >
              <Text
                style={{
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                Crea
              </Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetModal>
      {/* TAG BOTTOM SHEET */}

      {/* DELETE MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setDeleteModalVisible(false)}
            style={{ flex: 1 }}
          />
          <View
            style={[
              styles.modalView,
              { backgroundColor: colors.backgroundLighter },
            ]}
          >
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setDeleteModalVisible(!deleteModalVisible);
                deleteTag();
              }}
            >
              <Feather name="trash" size={24} color="#DC143C" />
              <Text style={[styles.modalButtonText, { color: "#DC143C" }]}>
                Elimina definitivamente
              </Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => setDeleteModalVisible(!deleteModalVisible)}
            >
              <AntDesign name="close" size={24} color={colors.text} />
              <Text style={[styles.modalButtonText, { color: colors.text }]}>
                Annulla
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* DELETE MODAL */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
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
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    borderRadius: 10,
    padding: 16,
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 50,
    // borderWidth: 1,
    // borderStyle: "solid",
  },
  modalButton: {
    borderRadius: 4,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  modalText: {
    // marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  modalButtonText: {
    color: "white",
    textAlign: "left",
  },
  bottomSheetView: {
    padding: 25,
    width: "100%",
  },
});
