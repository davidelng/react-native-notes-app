import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import * as Db from "../db/Db";
import { queries } from "../db/queries";
import TrashNoteButton from "../components/TrashNoteButton";
import { dateFormatter, getDateForCreation } from "../lib/dateFormatter";
import { Note } from "../../types";
import { AntDesign, Feather } from "@expo/vector-icons";
import TagBadge from "../components/TagBadge";
import { Tag } from "../../types";
import AIButton from "../components/AIButton";
import { generateCompletion } from "../lib/openai";
import Slider from "@react-native-community/slider";
import { AIPrompt } from "../../types";

const emptyAIPrompt: AIPrompt = { prompt: "", temperature: 0, maxTokens: 1000 };

const emptyNote: Note = {
  id: null,
  title: "",
  content: "",
  tag: null,
  tagColor: null,
  tagId: null,
  timestamp: getDateForCreation(),
  pinned: 0,
};

export default function Editor({ route, navigation }) {
  const { colors } = useTheme();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [AIModalVisible, setAIModalVisible] = useState(false);
  const [tags, setTags] = useState(null);
  const [AIPrompt, setAIPrompt] = useState(emptyAIPrompt);
  const [AILoading, setAILoading] = useState(false);
  const AITextRef = useRef(null);

  const [note, setNote] = useState(emptyNote);

  const db = Db.getConnection();

  let data: Note;

  useEffect(() => {
    if (route.params?.data) {
      data = {
        ...route.params.data,
        timestamp: dateFormatter(route.params.data.timestamp),
      };
      delete route.params.data;
    } else {
      data = emptyNote;
    }

    setNote(data);

    loadTags();
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            display: "flex",
            gap: 16,
            flexDirection: "row",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <AIButton onPress={() => setAIModalVisible(true)} />
          {note.id !== null && (
            <TrashNoteButton
              onPress={() => {
                setDeleteModalVisible(true);
              }}
            />
          )}
          <Pressable onPress={() => manageNote()}>
            <Feather name="save" size={24} style={{ color: colors.text }} />
          </Pressable>
        </View>
      ),
    });
  }, [note]);

  function createNote(note: Note) {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("insertNote"),
        [note.title, note.content, 0, note.tagId],
        (txObj, result) => {
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
        [note.title, note.content, 0, note.tagId, note.id],
        (txObj, result) => {
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
        currentNote.content !== initialData.content ||
        currentNote.tag !== initialData.tag)
    );
  }

  function manageNote() {
    if (note.id === null && note.title !== "") {
      createNote(note);
    } else if (note.id !== null && note.title !== "") {
      updateNote(note);
    } else {
      alert("Impossibile salvare la nota");
    }
    navigation.jumpTo("Tutte le note");
  }

  function deleteNote(id: number) {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("deleteNote"),
        [id],
        (txObj, result) => {
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

  function selectTag(tag: Tag | null) {
    if (tag !== null) {
      setNote((prev) => {
        return { ...prev, tagId: tag.id, tag: tag.name, tagColor: tag.color };
      });
    } else {
      setNote((prev) => {
        return { ...prev, tagId: null, tag: null, tagColor: null };
      });
    }
    setTagModalVisible(false);
  }

  function generateText(prompt: AIPrompt) {
    db.transaction((tx) => {
      tx.executeSql(
        queries.get("getConf"),
        ["OPENAI_API_KEY"],
        async (tx, res) => {
          const key = res.rows.item(0).value;
          const generatedText = await generateCompletion(
            key,
            prompt.prompt,
            prompt.temperature,
            prompt.maxTokens
          );
          setNote((prev) => {
            return {
              ...prev,
              content: prev.content + "\n\n-- AI Generated\n\n" + generatedText,
            };
          });
        },
        (tx, err) => {
          return false;
        }
      );
    });
  }

  function handleAIGeneration(prompt: AIPrompt) {
    setAILoading(true);
    if (AIPrompt.prompt !== "") {
      generateText(prompt);
      setAIModalVisible(false);
    }
    setAIPrompt(emptyAIPrompt);
    setAILoading(false);
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
        <Pressable
          style={styles.picker}
          onPress={() => setTagModalVisible(true)}
        >
          {!note.tag && (
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
                borderColor: colors.primary + "50",
                backgroundColor: colors.primary + "50",
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
          )}
          {note.tag && <TagBadge accent={note.tagColor} content={note.tag} />}
        </Pressable>
      </View>
      <ScrollView>
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
      </ScrollView>

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
            style={{ flex: 1, backgroundColor: "#00000080" }}
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
                deleteNote(note.id);
                navigation.navigate("Tutte le note");
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
              <Text style={styles.modalButtonText}>Annulla</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* DELETE MODAL */}

      {/* TAG MODAL */}
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
            style={{ flex: 1, backgroundColor: "#00000080" }}
          />
          <View
            style={[
              styles.modalView,
              { backgroundColor: colors.backgroundLighter },
            ]}
          >
            <Pressable
              onPress={() => selectTag(null)}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <AntDesign name="close" size={18} color={colors.text} />
              <Text style={{ color: colors.text }}>Nessuno</Text>
            </Pressable>
            {tags &&
              tags.map((tag: Tag) => {
                return (
                  <Pressable
                    key={tag.id}
                    onPress={() => selectTag(tag)}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      marginBottom: 16,
                    }}
                  >
                    <TagBadge accent={tag.color} content={tag.name} />
                  </Pressable>
                );
              })}
          </View>
        </View>
      </Modal>
      {/* TAG MODAL */}

      {/* AI MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={AIModalVisible}
        onRequestClose={() => {
          setAIPrompt(emptyAIPrompt);
          setAIModalVisible(!AIModalVisible);
        }}
        onShow={() => setTimeout(() => AITextRef.current.focus(), 100)}
      >
        <View
          style={[
            styles.centeredView,
            {
              backgroundColor: "#00000080",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            },
          ]}
        >
          {/* <Pressable
            onPress={() => setAIModalVisible(false)}
            style={{ flex: 1, backgroundColor: "#00000050" }}
          /> */}
          <View
            style={[
              styles.modalView,
              {
                backgroundColor: colors.backgroundLighter,
                borderRadius: 10,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              },
            ]}
          >
            {!AILoading ? (
              <>
                <TextInput
                  ref={AITextRef}
                  style={{
                    color: colors.text,
                    padding: 10,
                    marginBottom: 16,
                    fontSize: 14,
                    // backgroundColor: colors.notification + "20",
                    borderRadius: 8,
                  }}
                  placeholder="Chiedi qualcosa all'intelligenza artificiale"
                  placeholderTextColor={colors.notification}
                  multiline
                  value={AIPrompt.prompt}
                  onChangeText={(text) =>
                    setAIPrompt((prev) => {
                      return { ...prev, prompt: text };
                    })
                  }
                />
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <View
                    style={{
                      // backgroundColor: colors.notification + "20",
                      borderRadius: 8,
                      padding: 10,
                    }}
                  >
                    <Text style={{ color: colors.text }}>
                      Temperatura: {AIPrompt.temperature}
                    </Text>
                    <Slider
                      style={{ height: 30 }}
                      minimumValue={0}
                      maximumValue={1}
                      step={0.1}
                      minimumTrackTintColor={colors.primary}
                      maximumTrackTintColor="#000000"
                      thumbTintColor={colors.primary}
                      onValueChange={(val) =>
                        setAIPrompt((prev) => {
                          let temp = parseFloat(val.toFixed(1));
                          temp = temp === 1.0 ? 1 : temp;
                          return { ...prev, temperature: temp };
                        })
                      }
                    />
                  </View>
                  <View
                    style={{
                      // backgroundColor: colors.notification + "20",
                      borderRadius: 8,
                      padding: 10,
                    }}
                  >
                    <Text style={{ color: colors.text }}>
                      Max Tokens: {AIPrompt.maxTokens}
                    </Text>
                    <Slider
                      style={{ height: 30 }}
                      minimumValue={10}
                      maximumValue={1000}
                      minimumTrackTintColor={colors.primary}
                      maximumTrackTintColor="#000000"
                      thumbTintColor={colors.primary}
                      onValueChange={(val) =>
                        setAIPrompt((prev) => {
                          return { ...prev, maxTokens: Math.floor(val) };
                        })
                      }
                    />
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    gap: 16,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Pressable
                    style={[
                      styles.button,
                      {
                        borderWidth: 1,
                        borderColor: colors.primary,
                        borderRadius: 8,
                      },
                    ]}
                    onPress={() => {
                      setAIPrompt(emptyAIPrompt);
                      setAIModalVisible(!AIModalVisible);
                    }}
                  >
                    <Text style={styles.textStyle}>Annulla</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.button,
                      {
                        borderWidth: 1,
                        borderColor: colors.primary,
                        borderRadius: 8,
                        backgroundColor: colors.primary,
                      },
                    ]}
                    onPress={() => handleAIGeneration(AIPrompt)}
                  >
                    <Text style={[styles.textStyle, { color: colors.text }]}>
                      Genera
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              // <Text style={{ color: colors.text }}>
              //   Aspetta, sto elaborando..
              // </Text>
              <ActivityIndicator size="large" color={colors.primary} />
            )}
          </View>
        </View>
      </Modal>
      {/* AI MODAL */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    padding: 16,
    // borderBottomWidth: 1,
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
  },
  modalView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    width: "100%",
  },
  modalButtonText: {
    color: "white",
    textAlign: "left",
  },
  button: {
    borderRadius: 4,
    padding: 10,
    flex: 1,
  },
  modalButton: {
    borderRadius: 4,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
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
