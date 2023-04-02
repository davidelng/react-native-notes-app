import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useState, useEffect } from "react";
import * as Db from "../db/Db";
import { queries } from "../db/queries";
import TrashNoteButton from "../components/TrashNoteButton";
import { dateFormatter, getDateForCreation } from "../lib/dateUtils";
import { Note } from "../../types";
import { AntDesign, Feather } from "@expo/vector-icons";
import TagBadge from "../components/TagBadge";

export default function Editor({ route, navigation }) {
  const { colors } = useTheme();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [tags, setTags] = useState(null);

  const data: Note =
    route.params && route.params.data
      ? {
          ...route.params.data,
          timestamp: dateFormatter(route.params.data.timestamp),
        }
      : {
          id: null,
          title: "",
          content: "",
          tag: null,
          timestamp: getDateForCreation(),
          pinned: 0,
        };

  const [note, setNote] = useState({
    id: data.id,
    title: data.title,
    content: data.content,
    tag: data.tag,
    timestamp: data.timestamp,
    pinned: data.pinned,
  });

  const db = Db.getConnection("notes.sqlite");

  useEffect(() => {
    if (note.id !== null) {
      navigation.setOptions({
        headerRight: () => (
          <TrashNoteButton
            onPress={() => {
              setDeleteModalVisible(true);
            }}
          />
        ),
      });
    }

    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      manageNote();
      navigation.dispatch(e.data.action);
    });
    return unsubscribe;
  }, [navigation, note]);

  useEffect(() => {
    loadTags();
  }, []);

  function createNote(note: Note) {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("insertNote"),
        [note.title, note.content, 0, null],
        (txObj, result) => {
          // alert("Nota aggiunta");
          return true;
        },
        (txObj, err) => {
          alert(err.message);
          return false;
        }
      )
    );
  }

  function updateNote(note: Note) {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("updateNote"),
        [note.title, note.content, 0, 1, note.id],
        (txObj, result) => {
          // alert("Nota modificata");
          return true;
        },
        (txObj, err) => {
          alert(err.message);
          return false;
        }
      )
    );
  }

  function hasChanges(currentNote: Note, initialData: Note) {
    return (
      currentNote.title !== "" &&
      (currentNote.title !== initialData.title ||
        currentNote.content !== initialData.content)
    );
  }

  function manageNote() {
    if (note.id === null && note.title !== "") {
      createNote(note);
      return;
    } else if (note.id !== null && hasChanges(note, data)) {
      updateNote(note);
      return;
    }
  }

  function deleteNote(id: number) {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("deleteNote"),
        [id],
        (txObj, result) => {
          // alert("Nota eliminata");
          return true;
        },
        (txObj, err) => {
          alert(err.message);
          return false;
        }
      )
    );
  }

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

  return (
    <View style={styles.container}>
      <Text style={[styles.date, { color: colors.text }]}>
        {note.timestamp}
      </Text>
      <TextInput
        style={[
          styles.title,
          { borderBottomColor: colors.border, color: colors.text },
        ]}
        placeholder="Titolo"
        placeholderTextColor={colors.text}
        value={note.title}
        onChangeText={(text) =>
          setNote((prev) => {
            return { ...prev, title: text };
          })
        }
      />
      <View>
        <Pressable style={styles.picker} onPress={() => alert("tag")}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
              borderWidth: 1,
              borderStyle: "solid",
              borderRadius: 20,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderColor: colors.text + "50",
            }}
          >
            <Text style={{ color: colors.text }}>Tag</Text>
            <Feather
              name="chevron-down"
              size={16}
              color={colors.text}
              style={{ marginTop: 3 }}
            />
          </View>
          <TagBadge accent={"primary"} content={"Tag1"} />
        </Pressable>
      </View>
      <TextInput
        style={[styles.content, { color: colors.text }]}
        placeholder="..."
        placeholderTextColor={colors.notification}
        multiline
        value={note.content}
        onChangeText={(text) =>
          setNote((prev) => {
            return { ...prev, content: text };
          })
        }
      />

      {/* SAVE BUTTON
      <View style={{ margin: 20 }}>
        <Button title="Salva" color={colors.primary} onPress={manageNote} />
      </View> 
      */}

      {/* DELETE MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
      >
        <View style={styles.centeredView}>
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
            <View
              style={{
                margin: "auto",
                padding: 16,
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <AntDesign name="warning" size={32} color="#8b0000" />
            </View>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Procedere con l'eliminazione?
            </Text>
            <Text
              style={[
                styles.modalText,
                { color: colors.text, marginBottom: 20 },
              ]}
            >
              L'azione è irreversibile
            </Text>
            <View
              style={{
                display: "flex",
                gap: 16,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Pressable
                style={styles.button}
                onPress={() => setDeleteModalVisible(!deleteModalVisible)}
              >
                <Text style={styles.textStyle}>Annulla</Text>
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={() => {
                  setDeleteModalVisible(!deleteModalVisible);
                  deleteNote(note.id);
                  navigation.navigate("Drawer");
                }}
              >
                <Text style={[styles.textStyle, { color: "#8b0000" }]}>
                  Cancella
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* DELETE MODAL */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    padding: 16,
    borderBottomWidth: 1,
    fontSize: 20,
  },
  content: {
    padding: 16,
    flex: 1,
    textAlignVertical: "top",
  },
  date: {
    fontSize: 12,
    paddingHorizontal: 16,
    opacity: 0.7,
  },
  picker: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  button: {
    borderRadius: 4,
    padding: 10,
    flex: 1,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    // marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
});
