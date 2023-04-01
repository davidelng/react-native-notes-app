import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Modal,
  Pressable,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useState, useEffect } from "react";
import * as Db from "../db/Db";
import { queries } from "../db/queries";
import TrashNoteButton from "../components/TrashNoteButton";

function getDate() {
  return new Date().toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const emptyNote = {
  id: null,
  title: "",
  content: "",
  tag: null,
  date: getDate(),
  pinned: 0,
};

export default function Editor({ route, navigation }) {
  const { colors } = useTheme();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const data =
    route.params && route.params.data ? route.params.data : emptyNote;

  const [note, setNote] = useState({
    id: data.id,
    title: data.title,
    content: data.content,
    tag: data.tag,
    date: data.date,
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

    // const unsubscribe = navigation.addListener("beforeRemove", (e) => {
    //   e.preventDefault();
    //   manageNote();
    //   // navigation.dispatch(e.data.action);
    // });
    // return unsubscribe;
  }, [navigation]);

  function createNote(note) {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("insertNote"),
        [note.title, note.content, 0, 1],
        (txObj, result) => {
          alert("Nota aggiunta");
        },
        (txObj, err) => {
          alert(err.message);
          return false;
        }
      )
    );
  }

  function updateNote(note) {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("updateNote"),
        [note.title, note.content, 0, 1, note.id],
        (txObj, result) => {
          alert("Nota modificata");
        },
        (txObj, err) => {
          alert(err.message);
          return false;
        }
      )
    );
  }

  function manageNote() {
    if (note.id === null && note.title !== null) {
      // return createNote(note);
      alert(note.title);
    }
    // return updateNote(note);
    alert(note.id);
  }

  function deleteNote(id) {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("deleteNote"),
        [id],
        (txObj, result) => {
          alert("Nota eliminata");
        },
        (txObj, err) => {
          alert(err.message);
          return false;
        }
      )
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.date, { color: colors.text }]}>{note.date}</Text>
      <TextInput
        style={[
          styles.title,
          { borderBottomColor: colors.border, color: colors.text },
        ]}
        placeholder="Title"
        placeholderTextColor={colors.text}
        value={note.title}
        onChangeText={(text) =>
          setNote((prev) => {
            return { ...prev, title: text };
          })
        }
      />
      <TextInput
        style={[styles.content, { color: colors.text }]}
        placeholder="Content"
        placeholderTextColor={colors.text}
        multiline
        value={note.content}
        onChangeText={(text) =>
          setNote((prev) => {
            return { ...prev, content: text };
          })
        }
      />
      <View style={{ margin: 20 }}>
        <Button title="Salva" color={colors.primary} onPress={manageNote} />
      </View>
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
            <Text style={[styles.modalText, { color: colors.text }]}>
              Procedere con l'eliminazione? L'azione è irreversibile
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
  centeredView: {
    flex: 1,
    marginTop: 22,
    // flexDirection: "row",
    // alignItems: "flex-end",
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
    // elevation: 2,
    flex: 1,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
